"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IndicatorRecord } from "../../types/masters.types";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDateTime } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

export const getIndicatorColumns = ({
  locale,
  onView,
  onEdit,
  onDelete,
  t,
}: {
  locale: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (record: IndicatorRecord) => void;
  t: any;
}): ColumnDef<IndicatorRecord>[] => [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("code", { ns: "masters" })} />
    ),
    cell: ({ row }) => {
      const code = row.original.code;
      const displayCode =
        typeof code === "string"
          ? code
          : (code as any)?.[locale] || (code as any)?.en || "---";

      return (
        <span className="text-[14px] bg-[#eef4ff] text-[#3b82f6] px-3 py-1.5 rounded-md font-black tracking-tight border border-[#dbeafe]">
          {displayCode}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("name", { ns: "masters" })} />
    ),
    cell: ({ row }) => {
      const name = row.original.name;
      const displayName =
        typeof name === "string"
          ? name
          : (name as any)?.[locale] || (name as any)?.en || "";

      return (
        <div className="flex flex-col gap-1 py-1">
          <span className="font-extrabold text-[#1e293b] text-[15px] leading-tight cursor-default">
            {displayName}
          </span>
        </div>
      );
    },
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(row.original.id)}
          className="h-8 w-8 text-secondary"
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
