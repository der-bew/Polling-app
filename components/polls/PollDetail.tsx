'use client';

import { Card, Button } from "../ui";
import VoteResult from "./VoteResult";
import { useState } from "react";

export default function PollDetail({ poll, userVote }: { poll: any, userVote: any }) {
  const [error, setError] = useState<string | null>(null);

  if (userVote) {
    return <VoteResult poll={poll} />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const optionId = formData.get("option");

    if (typeof optionId === "string") {
      const response = await fetch(`/api/polls/${poll.id}/vote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ optionId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error);
      }
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 gap-4">
          {poll.options.map((option: any) => (
            <div key={option.id} className="flex items-center">
              <input
                type="radio"
                name="option"
                id={option.id}
                value={option.id}
                className="mr-2"
              />
              <label htmlFor={option.id}>{option.text}</label>
            </div>
          ))}
        </div>
        <Button className="mt-4">Vote</Button>
      </form>
    </Card>
  );
}
