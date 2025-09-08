
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to create a poll.' }, { status: 401 });
  }

  const { question, options } = await request.json();

  // Validate question and options
  const trimmedQuestion = question.trim();
  if (trimmedQuestion.length === 0) {
    return NextResponse.json({ error: 'Question cannot be empty.' }, { status: 400 });
  }

  const validOptions = options.map((opt: string) => opt.trim()).filter(Boolean);
  if (validOptions.length < 2) {
    return NextResponse.json({ error: 'You must provide at least two options.' }, { status: 400 });
  }

  // Step 1: Insert the poll record
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ question: trimmedQuestion, created_by: user.id })
    .select('id')
    .single();

  if (pollError) {
    console.error('Error creating poll:', pollError.message);
    return NextResponse.json({ error: 'Failed to create the poll.' }, { status: 500 });
  }

  // Step 2: Insert the associated option records
  const optionObjects = validOptions.map((text: string) => ({ text, poll_id: poll.id }));
  const { error: optionsError } = await supabase
    .from('options')
    .insert(optionObjects);

  if (optionsError) {
    console.error('Error creating options:', optionsError.message);
    // Atomic operation fallback: delete the poll if options fail to be created.
    await supabase.from('polls').delete().eq('id', poll.id);
    return NextResponse.json({ error: 'Failed to create the poll options.' }, { status: 500 });
  }

  revalidatePath('/polls');
  
  return NextResponse.json({ pollId: poll.id }, { status: 201 });
}
