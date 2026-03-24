"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useMasterData } from "@/hooks/use-master-data";
import { useLocale } from "@/hooks/use-locale";
import { MasterRecord } from "@/types/api.types";

import { DataTable } from "@/components/common/data-table/data-table";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTableSearch } from "@/components/common/data-table/data-table-search";
import { PermissionGuard } from "@/components/common/PermissionGuard";

interface MasterRecordTableProps {
  title: string;
  endpoint: string;
  basePath: string;
  resource?: string; // Optional resource name for permissions
  columns?: ColumnDef<any>[] | ((handlers: {
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (record: any) => void;
    t: any;
    locale: string;
    resource: string;
  }) => ColumnDef<any>[]);
}

export function MasterRecordTable({
  title,
  endpoint,
  basePath,
  resource: providedResource,
  columns: providedColumns,
}: MasterRecordTableProps) {
  const { t } = useTranslation(["common", "masters"]);
  const { locale } = useLocale();
  const router = useRouter();

  // Derived resource name for permissions (e.g. /sectors -> sectors)
  const resource = useMemo(() => {
    if (providedResource) return providedResource;
    return endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
  }, [providedResource, endpoint]);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [recordToDelete, setRecordToDelete] = useState<MasterRecord | null>(
    null,
  );

  const { query, deleteMutation } = useMasterData<MasterRecord>(endpoint, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: searchTerm,
  });

  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      await deleteMutation.mutateAsync(recordToDelete.id);
      toast.success(t("deleteSuccessful", { ns: "masters" }));
      setRecordToDelete(null);
    } catch (error) {
      toast.error(t("error"));
    }
  };

  // Fallback default columns
  const defaultColumns: ColumnDef<MasterRecord>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name", { ns: "masters" })} />
      ),
      cell: ({ row }) => {
        const name = row.original.name as any;
        const displayName =
          typeof name === "string" ? name : name?.[locale] || name?.en || "";
        return (
          <span className="font-extrabold text-[#1e293b] text-[14px]">{displayName}</span>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status", { ns: "masters" })} />
      ),
      cell: ({ row }) => <StatusBadge active={row.original.isActive} />,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("updatedAt", { ns: "masters" })} />
      ),
      cell: ({ row }) => (
        <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">
          {row.original.updatedAt?.split("T")[0]}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("actions", { ns: "masters" }),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <PermissionGuard permissions={[`${resource}:view`]} fallback={null}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`${basePath}/${row.original.id}`)}
              className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </PermissionGuard>
          <PermissionGuard permissions={[`${resource}:update`]} fallback={null}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`${basePath}/${row.original.id}/update`)}
              className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </PermissionGuard>
          <PermissionGuard permissions={[`${resource}:delete`]} fallback={null}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRecordToDelete(row.original)}
              className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  const handlers = {
    onView: (id: string) => router.push(`${basePath}/${id}`),
    onEdit: (id: string) => router.push(`${basePath}/${id}/update`),
    onDelete: (record: any) => setRecordToDelete(record),
    t,
    locale,
    resource, // Pass resource to handlers
  };

  const columns = typeof providedColumns === "function" 
    ? providedColumns(handlers) 
    : providedColumns || defaultColumns;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title={t(`${title}.title`, { ns: "masters" })}
          description={t(`${title}.description`, { ns: "masters" })}
          showBackButton={true}
          actions={
            <PermissionGuard permissions={[`${resource}:create`]} fallback={null}>
              <Button
                onClick={() => router.push(`${basePath}/create`)}
                className="gap-2 bg-primary hover:bg-primary/90 shadow-md shadow-primary/10 h-10 px-6 font-bold rounded-md"
              >
                <Plus className="h-4 w-4" />
                {t("create")}
              </Button>
            </PermissionGuard>
          }
        />
      </div>

      <DataTableSearch
        value={searchInput}
        onChange={setSearchInput}
        onSearch={setSearchTerm}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-0">
          <DataTable
            columns={columns}
            data={query.data?.data || []}
            pageCount={query.data?.meta?.totalPages || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            isLoading={query.isLoading}
            rowCount={query.data?.meta?.total || 0}
          />
        </div>
      </div>

      <ConfirmDialog
        open={!!recordToDelete}
        onOpenChange={(open) => !open && setRecordToDelete(null)}
        title={t("confirmDelete")}
        description={t("confirmDeleteDescription")}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
