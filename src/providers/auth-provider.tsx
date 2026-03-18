'use client';

import { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  // This is a thin wrapper that will be hydrated later
  // For now, it just renders the children
  return <>{children}</>;
}
