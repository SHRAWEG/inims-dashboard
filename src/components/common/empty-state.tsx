import { SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

interface EmptyStateProps {
  message?: string;
  icon?: ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface rounded-lg border border-border border-dashed h-48">
      {icon ? (
        <div className="text-text-tertiary mb-3">{icon}</div>
      ) : (
        <SearchX className="h-10 w-10 text-text-tertiary mb-3" />
      )}
      <p className="text-text-secondary">
        {message || t('noData')}
      </p>
    </div>
  );
}
