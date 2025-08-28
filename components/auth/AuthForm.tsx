// Placeholder for authentication form using Shadcn UI
// Update the import path to the correct location of Button and Input components
import { Button, Input } from "../ui";

export default function AuthForm() {
  return (
    <form className="space-y-4">
      <Input placeholder="Email" />
      <Input placeholder="Password" type="password" />
      <Button type="submit">Sign In</Button>
    </form>
  );
}
