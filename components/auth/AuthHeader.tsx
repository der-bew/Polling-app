"use client";

import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui';

export default function AuthHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full flex items-center justify-end p-4">
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">{user.email}</span>
          <Button onClick={() => signOut()}>Sign out</Button>
        </div>
      ) : (
        <div />
      )}
    </header>
  );
}
