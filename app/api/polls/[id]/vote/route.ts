
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to vote.' }, { status: 401 });
  }

  const pollId = params.id;
  const { optionId } = await request.json();

  // Check if the user has already voted on this poll to prevent double-voting.
  const { count, error: countError } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('poll_id', pollId)
    .eq('user_id', user.id);

  if (countError) {
    console.error('Error checking for existing votes:', countError.message);
    return NextResponse.json({ error: 'Could not verify your voting status.' }, { status: 500 });
  }

  if (count !== null && count > 0) {
    return NextResponse.json({ error: 'You have already voted on this poll.' }, { status: 409 });
  }

  // Record the new vote
  const { error: insertError } = await supabase
    .from('votes')
    .insert({ poll_id: pollId, option_id: optionId, user_id: user.id });

  if (insertError) {
    console.error('Error submitting vote:', insertError.message);
    return NextResponse.json({ error: 'There was an error submitting your vote.' }, { status: 500 });
  }

  revalidatePath(`/polls/${pollId}`);

  return NextResponse.json({ success: true }, { status: 201 });
}
