// polling-app/app/polls/new/page.tsx
import NewPollForm from '@/components/polls/new/NewPollForm';

export default function CreatePollPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Create a New Poll</h1>
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 dark:bg-gray-800 w-full max-w-xl">
          <NewPollForm />
        </div>
      </main>
    </div>
  );
}