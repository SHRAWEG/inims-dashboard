"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, Edit, Trash2, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { useMasterData } from "@/hooks/use-master-data";
import { useLocale } from "@/hooks/use-locale";
import { MsnpIndicatorRecord } from "@/types/api.types";
import { LocalizedField } from "@/types/i18n.types";
import { ENDPOINTS } from "@/lib/api/endpoints";

import { DataTable } from "@/components/common/data-table/data-table";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatDateTime } from "@/lib/utils/format";

const recordSchema = z.object({
  code: z.object({
    en: z.string().min(1, "English code is required"),
    ne: z.string().min(1, "Nepali code is required"),
  }),
  name: z.object({
    en: z.string().min(1, "English name is required"),
    ne: z.string().min(1, "Nepali name is required"),
  }),
  isActive: z.boolean(),
});

type RecordFormValues = z.infer<typeof recordSchema>;

export function MsnpIndicatorManager({ title }: { title: string }) {
  const { t } = useTranslation("common");
  const { locale } = useLocale();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<MsnpIndicatorRecord | null>(null);
  const [recordToDelete, setRecordToDelete] =
    useState<MsnpIndicatorRecord | null>(null);

  // Translation Mode Toggle
  const [isTranslationMode, setIsTranslationMode] = useState(false);

  // We always fetch translations so we can display translation mode seamlessly and edit records
  const { query, createMutation, updateMutation, deleteMutation } =
    useMasterData<MsnpIndicatorRecord>(ENDPOINTS.MSNP_INDICATORS.BASE, {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: searchTerm,
    });

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      code: { en: "", ne: "" },
      name: { en: "", ne: "" },
      isActive: true,
    },
  });

  const handleCreate = () => {
    setEditingRecord(null);
    form.reset({
      code: { en: "", ne: "" },
      name: { en: "", ne: "" },
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record: MsnpIndicatorRecord) => {
    setEditingRecord(record);
    const codeObj = record.code as LocalizedField;
    const nameObj = record.name as LocalizedField;
    form.reset({
      code: { en: codeObj?.en || "", ne: codeObj?.ne || "" },
      name: { en: nameObj?.en || "", ne: nameObj?.ne || "" },
      isActive: record.isActive,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: RecordFormValues) => {
    try {
      if (editingRecord) {
        await updateMutation.mutateAsync({ id: editingRecord.id, data });
        toast.success(t("update") + " Successful");
      } else {
        await createMutation.mutateAsync(data);
        toast.success(t("create") + " Successful");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(t("error"));
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      await deleteMutation.mutateAsync(recordToDelete.id);
      toast.success(t("delete") + " Successful");
      setRecordToDelete(null);
    } catch (error) {
      toast.error(t("error"));
    }
  };

  // Define Standard Columns
  const standardColumns: ColumnDef<MsnpIndicatorRecord>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
      cell: ({ row }) => {
        const code = row.original.code as any;
        if (typeof code === "string")
          return <span className="font-mono">{code}</span>;
        return (
          <span className="font-mono">{code?.[locale] || code?.en || ""}</span>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const name = row.original.name as any;
        if (typeof name === "string") return <span>{name}</span>;
        return <span>{name?.[locale] || name?.en || ""}</span>;
      },
    },
  ];

  // Define Translation Mode Columns
  const translationColumns: ColumnDef<MsnpIndicatorRecord>[] = [
    {
      id: "code-en",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code (EN)" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {(row.original.code as LocalizedField)?.en}
        </span>
      ),
    },
    {
      id: "code-ne",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code (NE)" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {(row.original.code as LocalizedField)?.ne}
        </span>
      ),
    },
    {
      id: "name-en",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name (EN)" />
      ),
      cell: ({ row }) => (
        <span className="text-xs">
          {(row.original.name as LocalizedField)?.en}
        </span>
      ),
    },
    {
      id: "name-ne",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name (NE)" />
      ),
      cell: ({ row }) => (
        <span className="text-xs">
          {(row.original.name as LocalizedField)?.ne}
        </span>
      ),
    },
  ];

  const commonColumnsEnd: ColumnDef<MsnpIndicatorRecord>[] = [
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => <StatusBadge active={row.original.isActive} />,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("updatedAt")} />
      ),
      cell: ({ row }) => (
        <span className="text-text-secondary text-sm">
          {formatDateTime(row.original.updatedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="h-4 w-4 text-text-secondary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRecordToDelete(row.original)}
          >
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
        </div>
      ),
    },
  ];

  const columns = isTranslationMode
    ? [...translationColumns, ...commonColumnsEnd]
    : [...standardColumns, ...commonColumnsEnd];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        actions={
          <div className="flex items-center gap-3">
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              {t("create")}
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input
            placeholder="Search by code or name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearchTerm(searchInput)}
            className="pl-9"
          />
        </div>
        <Button variant="secondary" onClick={() => setSearchTerm(searchInput)}>
          {t("search")}
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingRecord ? t("edit") : t("create")}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 pt-4"
            >
              <div className="grid grid-cols-2 gap-4 border border-border rounded-lg p-4 bg-surface/50">
                <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Code Identification
                </div>
                <FormField
                  control={form.control}
                  name="code.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code (English)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. MSNP-01"
                          className="font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code.ne"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code (Nepali)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. MSNP-01"
                          className="font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border border-border rounded-lg p-4 bg-surface/50">
                <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Indicator Name
                </div>
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
                        <Input
                          placeholder="नेपाली नाम प्रविष्ट गर्नुहोस्"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>{t("status")}</FormLabel>
                      <p className="text-xs text-text-secondary">
                        {field.value ? t("active") : t("inactive")}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {t("save")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
