import { Button, Card } from "@/components/ui";
import Protected from '@/components/auth/Protected';
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AuthHeader from "../auth/AuthHeader";

export default async function PollsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <Protected>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
          <AuthHeader user={user} />
          <h1 className="text-4xl font-bold mb-8">Polls</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Placeholder Poll Card 1 */}
          <Card>
            <div className="mb-2">
              <h3 className="text-lg font-semibold">Favorite Programming Language?</h3>
              <p className="text-sm text-gray-600">Poll created by: User123</p>
            </div>
            <div>
              <p className="mb-4">Options:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>JavaScript</li>
                <li>Python</li>
                <li>Java</li>
                <li>C++</li>
              </ul>
              <div className="mt-6 flex justify-end">
                <Button>View Details</Button>
              </div>
            </div>
          </Card>

          {/* Placeholder Poll Card 2 */}
          <Card>
            <div className="mb-2">
              <h3 className="text-lg font-semibold">Best Way to Learn Next.js?</h3>
              <p className="text-sm text-gray-600">Poll created by: DevGuru</p>
            </div>
            <div>
              <p className="mb-4">Options:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Official Documentation</li>
                <li>Tutorials</li>
                <li>Building Projects</li>
                <li>Community Forums</li>
              </ul>
              <div className="mt-6 flex justify-end">
                <Button>View Details</Button>
              </div>
            </div>
          </Card>

          {/* Placeholder Poll Card 3 */}
          <Card>
            <div className="mb-2">
              <h3 className="text-lg font-semibold">What's your favorite frontend framework?</h3>
              <p className="text-sm text-gray-600">Poll created by: UIEnthusiast</p>
            </div>
            <div>
              <p className="mb-4">Options:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>React</li>
                <li>Vue</li>
                <li>Angular</li>
                <li>Svelte</li>
              </ul>
              <div className="mt-6 flex justify-end">
                <Button>View Details</Button>
              </div>
            </div>
          </Card>

          {/* Add more placeholder poll cards as needed */}

        </div>
      </main>
    </div>
    </Protected>
  );
}