'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createPoll } from '@/app/actions';
import { Button, Input } from '@/components/ui';

const initialState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Poll'}
    </Button>
  );
}

export default function NewPollForm() {
  const [options, setOptions] = useState(['', '']);
  const [state, formAction] = useActionState(createPoll, initialState);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  return (
    <form className="space-y-4" action={formAction}>
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <Input
        name="question"
        placeholder="Poll Question"
        required
      />
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            name="options"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
          />
          {options.length > 2 && (
            <Button type="button" onClick={() => removeOption(index)} variant="destructive">Remove</Button>
          )}
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Button type="button" onClick={addOption}>Add Option</Button>
        <SubmitButton />
      </div>
    </form>
  );
}