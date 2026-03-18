# Tables

## Section 1 — Column definitions

`src/components/sectors/sector-columns.tsx`:
```tsx
export function useSectorColumns(): ColumnDef<Sector>[] {
  const { t } = useTranslation('sectors');

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('name')} />
      ),
    },
    {
      accessorKey: 'isActive',
      header: t('status'),
      cell: ({ row }) => <StatusBadge active={row.original.isActive} />,
    },
    {
      accessorKey: 'createdAt',
      header: t('common:createdAt'),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      cell: ({ row }) => <SectorActions sector={row.original} />,
    },
  ];
}
```

Note: columns defined as a hook (`useSectorColumns`) so they can use `useTranslation`.

## Section 2 — Table wrapper

`src/components/sectors/sector-table.tsx`:
```tsx
export function SectorTable() {
  const { t } = useTranslation('sectors');
  const { locale } = useLocale();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>();
  const [open, setOpen] = useState(false);
  const columns = useSectorColumns();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: sectorKeys.list({ page: pagination.pageIndex + 1, limit: pagination.pageSize, search, isActive: isActiveFilter, locale }),
    queryFn: () => sectorsApi.getAll({ page: pagination.pageIndex + 1, limit: pagination.pageSize, search, isActive: isActiveFilter, locale }),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          {/* isActive filter */}
          <Button onClick={() => setOpen(true)}>
            {t('addSector')}
          </Button>
        </div>
      </div>

      {/* Table */}
      {isError ? (
        <ErrorState message={(error as AppError).message} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          pageCount={data?.meta.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
        />
      )}

      {/* Add sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-[480px]">
          <SheetHeader>
            <SheetTitle>{t('addSector')}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SectorForm onSuccess={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
```

## Section 3 — Row actions

`src/components/sectors/sector-actions.tsx`:
```tsx
export function SectorActions({ sector }: { sector: Sector }) {
  const { t } = useTranslation('sectors');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => sectorsApi.delete(sector.id),
    onSuccess: () => {
      toast.success(t('deletedSuccessfully'));
      queryClient.invalidateQueries({ queryKey: sectorKeys.lists() });
      setDeleteOpen(false);
    },
    onError: (error: AppError) => toast.error(error.message),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            {t('common:edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-danger"
            onClick={() => setDeleteOpen(true)}
          >
            {t('common:delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="sm:max-w-[480px]">
          <SheetHeader>
            <SheetTitle>{t('editSector')}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SectorForm
              defaultValues={sector}
              onSuccess={() => setEditOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common:confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteWarning', { name: sector.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common:cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger hover:bg-danger/90"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {t('common:delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

## Section 4 — Rules

- `pageIndex` is 0-based in TanStack — always `+1` when sending to API
- Always show skeleton rows during `isLoading`
- Always show `EmptyState` when `data.length === 0` and not loading
- Always show `ErrorState` when `isError`
- Destructive actions always behind `AlertDialog` — never immediate
- Edit always in a `Sheet` — never inline
- Row actions always in a `DropdownMenu` in the last column
