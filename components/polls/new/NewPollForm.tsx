// Placeholder for new poll form using Shadcn UI
import { Button, Input } from "../../ui";

export default function NewPollForm() {
  return (
    <form className="space-y-4">
      <Input placeholder="Poll Question" />
      <Input placeholder="Option 1" />
      <Input placeholder="Option 2" />
      <Button type="submit">Create Poll</Button>
    </form>
  );
}
