"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Input, Button } from '@/components/ui';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
    router.push('/polls');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md w-full p-6 space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <Button type="submit">Create account</Button>
      </form>
    </div>
  );
}
