// polling-app/app/polls/new/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

export default function CreatePollPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // Start with two empty options

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (indexToRemove: number) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the poll data to an API
    console.log({ question, options: options.filter(opt => opt.trim() !== '') });
    alert("Poll created (check console for data)!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Create a New Poll</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 dark:bg-gray-800 w-full max-w-xl">
          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="poll-question">
              Poll Question
            </Label>
            <Textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="poll-question"
              placeholder="e.g., What is your favorite color?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <Label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
              Options
            </Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-3">
                <Input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-3"
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                {options.length > 2 && ( // Only show remove button if more than 2 options
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddOption}
              className="mt-2 w-full flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Poll
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
