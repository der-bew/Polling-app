import { Card } from "../ui";

export default function VoteResult({ poll }: { poll: any }) {
  const totalVotes = poll.options.reduce((acc: number, option: any) => acc + option.votes.length, 0);

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
      <div className="grid grid-cols-1 gap-4">
        {poll.options.map((option: any) => {
          const voteCount = option.votes.length;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          return (
            <div key={option.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{option.text}</span>
                <span className="text-sm text-gray-600">{voteCount} votes ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
