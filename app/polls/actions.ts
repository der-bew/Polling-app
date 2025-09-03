'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Creates a new poll with a question and a set of options.
 * @param question The poll question.
 * @param options An array of strings representing the poll options.
 */
export async function createPoll(question: string, options: string[]) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to create a poll.' };
  }

  // Validate question and options
  const trimmedQuestion = question.trim();
  if (trimmedQuestion.length === 0) {
    return { error: 'Question cannot be empty.' };
  }

  const validOptions = options.map(opt => opt.trim()).filter(Boolean);
  if (validOptions.length < 2) {
    return { error: 'You must provide at least two options.' };
  }

  // Step 1: Insert the poll record
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ question: trimmedQuestion, created_by: user.id })
    .select('id')
    .single();

  if (pollError) {
    console.error('Error creating poll:', pollError.message);
    return { error: 'Failed to create the poll.' };
  }

  // Step 2: Insert the associated option records
  const optionObjects = validOptions.map(text => ({ text, poll_id: poll.id }));
  const { error: optionsError } = await supabase
    .from('options')
    .insert(optionObjects);

  if (optionsError) {
    console.error('Error creating options:', optionsError.message);
    // Atomic operation fallback: delete the poll if options fail to be created.
    await supabase.from('polls').delete().eq('id', poll.id);
    return { error: 'Failed to create the poll options.' };
  }

  revalidatePath('/polls');
  redirect(`/polls/${poll.id}`);
}

/**
 * Submits a vote for a specific option in a poll.
 * @param pollId The ID of the poll being voted on.
 * @param optionId The ID of the selected option.
 */
export async function vote(pollId: string, optionId: string) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to vote.' };
  }

  // Check if the user has already voted on this poll to prevent double-voting.
  const { count, error: countError } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('poll_id', pollId)
    .eq('user_id', user.id);

  if (countError) {
    console.error('Error checking for existing votes:', countError.message);
    return { error: 'Could not verify your voting status.' };
  }

  if (count !== null && count > 0) {
    return { error: 'You have already voted on this poll.' };
  }

  // Record the new vote
  const { error: insertError } = await supabase
    .from('votes')
    .insert({ poll_id: pollId, option_id: optionId, user_id: user.id });

  if (insertError) {
    console.error('Error submitting vote:', insertError.message);
    return { error: 'There was an error submitting your vote.' };
  }

  revalidatePath(`/polls/${pollId}`);

  return { success: true };
}
