import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-surface rounded-xl border border-border p-8 shadow-sm flex flex-col items-center text-center max-w-md w-full">
        <FileQuestion className="h-16 w-16 text-text-tertiary mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">404 - Page not found</h1>
        <p className="text-text-secondary mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="w-full">
          <Link href="/dashboard">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
