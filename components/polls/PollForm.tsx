import React from 'react';
import { Input, Button, Card } from '../ui';

export default function PollForm() {
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-2">Create Poll (placeholder)</h2>
      <form className="space-y-3">
        <Input placeholder="Question" />
        <Input placeholder="Option 1" />
        <Input placeholder="Option 2" />
        <Button>Create</Button>
      </form>
    </Card>
  );
}
