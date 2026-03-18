'use client';

import { ErrorState } from '@/components/common/error-state';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <ErrorState message={error.message || 'Something went wrong.'} />
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
