import { Button, Card } from "@/components/ui";
import Protected from '@/components/auth/Protected';
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AuthHeader from "../auth/AuthHeader";
import Link from "next/link";

export default async function PollsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: polls, error } = await supabase.from("polls").select("*, options (id, text)");

  return (
    <Protected>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
          <AuthHeader user={user} />
          <div className="flex justify-between w-full max-w-6xl mb-8">
            <h1 className="text-4xl font-bold">Polls</h1>
            <Link href="/polls/new">
              <Button>Create Poll</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {polls?.map((poll) => (
              <Card key={poll.id}>
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{poll.question}</h3>
                </div>
                <div>
                  <p className="mb-4">Options:</p>
                  <ul className="list-disc list-inside space-y-2">
                    {poll.options.map((option) => (
                      <li key={option.id}>{option.text}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex justify-end">
                    <Link href={`/polls/${poll.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </Protected>
  );
}
