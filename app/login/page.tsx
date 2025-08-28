"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Input, Button } from '@/components/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error.message ?? String(res.error));
      return;
    }
    router.push('/polls');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600">{error}</div>}
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
      </div>
    </div>
  );
}
