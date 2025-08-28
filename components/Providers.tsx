"use client";

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import AuthHeader from '@/components/auth/AuthHeader';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthHeader />
      {children}
    </AuthProvider>
  );
}
