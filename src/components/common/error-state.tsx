import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-danger-bg/50 rounded-lg border border-danger/20 h-48">
      <AlertCircle className="h-10 w-10 text-danger mb-3" />
      <p className="text-danger font-medium mb-4">
        {message || t('error')}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} size="sm">
          {t('tryAgain')}
        </Button>
      )}
    </div>
  );
}
