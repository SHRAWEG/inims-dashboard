"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BaseMasterRecord } from "../../types/masters.types";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDateTime } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

export const getCommonColumns = ({
  locale,
  onView,
  onEdit,
  onDelete,
  t,
}: {
  locale: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (record: BaseMasterRecord) => void;
  t: any;
}): ColumnDef<BaseMasterRecord>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("name", { ns: "masters" })} />,
    cell: ({ row }) => {
      const name = row.original.name as any;
      const displayName = typeof name === "string" ? name : name?.[locale] || name?.en || "";
      return <span className="font-extrabold text-[#1e293b] text-[14px]">{displayName}</span>;
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("status", { ns: "masters" })} />,
    cell: ({ row }) => <StatusBadge active={row.original.isActive} />,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("updatedAt", { ns: "masters" })} />,
    cell: ({ row }) => (
      <span className="text-slate-400 text-xs font-bold font-mono">
        {row.original.updatedAt?.split("T")[0]}
      </span>
    ),
  },
  {
    id: "actions",
    header: t("actions", { ns: "masters" }),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(row.original.id)}
          className="h-8 w-8 text-slate-400"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original.id)}
          className="h-8 w-8 text-slate-400"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original)}
          className="h-8 w-8 text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
