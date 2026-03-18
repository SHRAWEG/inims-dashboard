import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  active: boolean;
}

export function StatusBadge({ active }: StatusBadgeProps) {
  const { t } = useTranslation('common');

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-md ${
        active 
          ? 'bg-success-bg text-success' 
          : 'bg-danger-bg text-danger'
      }`}
    >
      {active ? t('active') : t('inactive')}
    </span>
  );
}
