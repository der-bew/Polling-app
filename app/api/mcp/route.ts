
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Define the structure of a JSON-RPC 2.0 request
interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: any;
  id?: string | number | null;
}

// --- MCP Tool and Resource Implementations ---

async function getPoll(params: { id: string }) {
  const supabase = createSupabaseServerClient();
  const { data: poll, error } = await supabase
    .from('polls')
    .select('*, options(*), votes(*)')
    .eq('id', params.id)
    .single();

  if (error) {
    throw new Error(`Poll not found: ${error.message}`);
  }
  return poll;
}

async function listPolls() {
  const supabase = createSupabaseServerClient();
  const { data: polls, error } = await supabase
    .from('polls')
    .select('*, options(*), votes(*)')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch polls: ${error.message}`);
  }
  return polls;
}

async function createPoll(params: { question: string; options: string[] }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to create a poll.');
  }

  const { question, options } = params;
  const trimmedQuestion = question.trim();
  if (trimmedQuestion.length === 0) {
    throw new Error('Question cannot be empty.');
  }

  const validOptions = options.map((opt: string) => opt.trim()).filter(Boolean);
  if (validOptions.length < 2) {
    throw new Error('You must provide at least two options.');
  }

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ question: trimmedQuestion, created_by: user.id })
    .select('id')
    .single();

  if (pollError) {
    throw new Error(`Failed to create the poll: ${pollError.message}`);
  }

  const optionObjects = validOptions.map((text: string) => ({ text, poll_id: poll.id }));
  const { error: optionsError } = await supabase.from('options').insert(optionObjects);

  if (optionsError) {
    await supabase.from('polls').delete().eq('id', poll.id);
    throw new Error(`Failed to create the poll options: ${optionsError.message}`);
  }

  revalidatePath('/polls');
  return { pollId: poll.id };
}

async function vote(params: { pollId: string; optionId: string }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to vote.');
  }

  const { pollId, optionId } = params;

  const { count, error: countError } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('poll_id', pollId)
    .eq('user_id', user.id);

  if (countError) {
    throw new Error(`Could not verify your voting status: ${countError.message}`);
  }

  if (count !== null && count > 0) {
    throw new Error('You have already voted on this poll.');
  }

  const { error: insertError } = await supabase
    .from('votes')
    .insert({ poll_id: pollId, option_id: optionId, user_id: user.id });

  if (insertError) {
    throw new Error(`There was an error submitting your vote: ${insertError.message}`);
  }

  revalidatePath(`/polls/${pollId}`);
  return { success: true };
}

// --- MCP Server Endpoint ---

const availableMethods: { [key: string]: Function } = {
  getPoll,
  listPolls,
  createPoll,
  vote,
};

export async function POST(request: NextRequest) {
  const { jsonrpc, method, params, id } = (await request.json()) as JsonRpcRequest;

  if (jsonrpc !== '2.0' || !method) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request' },
      id,
    }, { status: 400 });
  }

  const func = availableMethods[method];
  if (!func) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32601, message: 'Method not found' },
      id,
    }, { status: 404 });
  }

  try {
    const result = await func(params);
    return NextResponse.json({
      jsonrpc: '2.0',
      result,
      id,
    });
  } catch (error: any) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32000, message: `Server error: ${error.message}` },
      id,
    }, { status: 500 });
  }
}
