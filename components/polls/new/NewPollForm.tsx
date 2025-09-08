'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from "../../ui";

export default function NewPollForm() {
  const router = useRouter();
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

    const response = await fetch('/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, options }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error);
    } else {
      router.push(`/polls/${result.pollId}`);
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
