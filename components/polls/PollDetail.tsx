import { Card, Button } from "../ui";
import { vote } from "@/app/polls/actions";
import VoteResult from "./VoteResult";

export default function PollDetail({ poll, userVote }: { poll: any, userVote: any }) {
  if (userVote) {
    return <VoteResult poll={poll} />;
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
      <form action={async (formData) => {
        const optionId = formData.get("option");
        if (typeof optionId === "string") {
          await vote(poll.id, optionId);
        }
      }}>
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
