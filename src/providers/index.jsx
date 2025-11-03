'use client';

import { AuthProvider } from './auth-provider';
import { Toaster } from 'sonner';

export function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}

