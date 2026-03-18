'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { useMasterData } from '@/hooks/use-master-data';
import { useLocale } from '@/hooks/use-locale';
import { MasterRecord } from '@/types/api.types';
import { LocalizedField } from '@/types/i18n.types';

import { DataTable } from '@/components/common/data-table/data-table';
import { DataTableColumnHeader } from '@/components/common/data-table/data-table-column-header';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { ConfirmDialog } from '@/components/common/confirm-dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { formatDateTime } from '@/lib/utils/format';

const recordSchema = z.object({
  name: z.object({
    en: z.string().min(1, 'English name is required'),
    ne: z.string().min(1, 'Nepali name is required'),
  }),
  isActive: z.boolean(),
});

type RecordFormValues = z.infer<typeof recordSchema>;

interface MasterRecordManagerProps {
  title: string;
  endpoint: string;
}

export function MasterRecordManager({ title, endpoint }: MasterRecordManagerProps) {
  const { t } = useTranslation('common');
  const { locale } = useLocale();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Local state for input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MasterRecord | null>(null);
  
  const [recordToDelete, setRecordToDelete] = useState<MasterRecord | null>(null);

  const { query, createMutation, updateMutation, deleteMutation } = useMasterData<MasterRecord>(endpoint, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: searchTerm,
  });

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      name: { en: '', ne: '' },
      isActive: true,
    },
  });

  // Open modal for Create
  const handleCreate = () => {
    setEditingRecord(null);
    form.reset({ name: { en: '', ne: '' }, isActive: true });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleEdit = (record: MasterRecord) => {
    setEditingRecord(record);
    const nameObj = record.name as LocalizedField;
    form.reset({
      name: { en: nameObj?.en || '', ne: nameObj?.ne || '' },
      isActive: record.isActive,
    });
    setIsModalOpen(true);
  };

  // Submit Form
  const onSubmit = async (data: RecordFormValues) => {
    try {
      if (editingRecord) {
        await updateMutation.mutateAsync({ id: editingRecord.id, data });
        toast.success(t('update') + ' Successful');
      } else {
        await createMutation.mutateAsync(data);
        toast.success(t('create') + ' Successful');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(t('error'));
    }
  };

  // Delete Action
  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      await deleteMutation.mutateAsync(recordToDelete.id);
      toast.success(t('delete') + ' Successful');
      setRecordToDelete(null);
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const columns: ColumnDef<MasterRecord>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('name')} />,
      cell: ({ row }) => {
        const name = row.original.name as any;
        if (typeof name === 'string') return <span>{name}</span>;
        return <span>{name?.[locale] || name?.en || ''}</span>;
      },
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('status')} />,
      cell: ({ row }) => <StatusBadge active={row.original.isActive} />,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('updatedAt')} />,
      cell: ({ row }) => <span className="text-text-secondary text-sm">{formatDateTime(row.original.updatedAt)}</span>,
    },
    {
      id: 'actions',
      header: t('actions'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4 text-text-secondary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setRecordToDelete(row.original)}>
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('create')}
          </Button>
        }
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input
            placeholder={t('search')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchTerm(searchInput)}
            className="pl-9"
          />
        </div>
        <Button variant="secondary" onClick={() => setSearchTerm(searchInput)}>
          {t('search')}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={query.data?.data || []}
        pageCount={query.data?.meta?.totalPages || -1}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={query.isLoading}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRecord ? t('edit') : t('create')}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter English name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name.ne"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Nepali)</FormLabel>
                    <FormControl>
                      <Input placeholder="नेपाली नाम प्रविष्ट गर्नुहोस्" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>{t('status')}</FormLabel>
                      <p className="text-xs text-text-secondary">
                        {field.value ? t('active') : t('inactive')}
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {t('save')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!recordToDelete}
        onOpenChange={(open) => !open && setRecordToDelete(null)}
        title={t('confirmDelete')}
        description={t('confirmDeleteDescription')}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
