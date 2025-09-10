'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface FormState {
  error: string | null;
}

export async function createPoll(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to create a poll.' };
  }

  const question = formData.get('question') as string;
  const options = formData.getAll('options') as string[];

  // Validate question and options
  const trimmedQuestion = question.trim();
  if (trimmedQuestion.length === 0) {
    return { error: 'Question cannot be empty.' };
  }

  const validOptions = options.map((opt) => opt.trim()).filter(Boolean);
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
  const optionObjects = validOptions.map((text: string) => ({
    text,
    poll_id: poll.id,
  }));
  const { error: optionsError } = await supabase
    .from('options')
    .insert(optionObjects);

  if (optionsError) {
    console.error('Error creating options:', optionsError.message);
    // Atomic operation fallback: delete the poll if options fail.
    await supabase.from('polls').delete().eq('id', poll.id);
    return { error: 'Failed to create the poll options.' };
  }

  revalidatePath('/polls');
  redirect(`/polls/${poll.id}`);
}
