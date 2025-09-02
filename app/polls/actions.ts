'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPoll(question: string, options: string[]) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to create a poll.' };
  }

  if (!question || question.trim().length === 0) {
    return { error: 'Question cannot be empty.' };
  }

  const filteredOptions = options.filter(option => option.trim().length > 0);
  if (filteredOptions.length < 2) {
    return { error: 'You must provide at least two options.' };
  }

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert([{ question, created_by: user.id }])
    .select()
    .single();

  if (pollError) {
    return { error: 'Error creating the poll.' };
  }

  const optionObjects = filteredOptions.map(option => ({ text: option, poll_id: poll.id }));

  const { error: optionsError } = await supabase
    .from('options')
    .insert(optionObjects);

  if (optionsError) {
    // Clean up the created poll if options insertion fails
    await supabase.from('polls').delete().eq('id', poll.id);
    return { error: 'Error creating the options.' };
  }

  revalidatePath('/polls');
  redirect(`/polls/${poll.id}`);
}

export async function vote(pollId: string, optionId: string) {
  const supabase = createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to vote.' };
  }

  // Check if the user has already voted on this poll
  const { data: existingVote, error: existingVoteError } = await supabase
    .from('votes')
    .select('id')
    .eq('poll_id', pollId)
    .eq('user_id', user.id)
    .single();

  if (existingVote) {
    return { error: 'You have already voted on this poll.' };
  }

  if (existingVoteError && existingVoteError.code !== 'PGRST116') { // PGRST116: no rows found
    return { error: 'Error checking for existing votes.' };
  }

  const { data, error } = await supabase
    .from('votes')
    .insert([{ poll_id: pollId, option_id: optionId, user_id: user.id }]);

  if (error) {
    return { error: 'Error submitting your vote.' };
  }

  revalidatePath(`/polls/${pollId}`);

  return { success: true };
}
