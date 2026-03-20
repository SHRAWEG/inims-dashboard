import { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils/cn';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <div className={cn('text-[11px] font-extrabold text-[#5e718d] uppercase tracking-widest', className)}>
      {title}
    </div>
  );
}
