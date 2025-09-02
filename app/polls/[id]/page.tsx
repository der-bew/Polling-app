
import PollDetail from "@/components/polls/PollDetail";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function PollDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: poll, error } = await supabase
    .from("polls")
    .select(`
      *,
      options ( id, text, votes ( id ) ),
      votes ( user_id, option_id )
    `)
    .eq("id", params.id)
    .single();

  if (error || !poll) {
    notFound();
  }

  const userVote = poll.votes.find((v: any) => v.user_id === user?.id);

  return <PollDetail poll={poll} userVote={userVote} />;
}
