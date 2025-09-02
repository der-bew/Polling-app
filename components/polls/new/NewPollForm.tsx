'use client';

import { useState } from 'react';
import { Button, Input } from "../../ui";
import { createPoll } from '@/app/polls/actions';

export default function NewPollForm() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = await createPoll(question, options);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      <Input
        placeholder="Poll Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
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
        <Button type="submit">Create Poll</Button>
      </div>
    </form>
  );
}
