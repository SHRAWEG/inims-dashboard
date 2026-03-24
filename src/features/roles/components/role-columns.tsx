"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Role } from "../types/role.types";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { PermissionGuard } from "@/components/common/PermissionGuard";

export const getRoleColumns = ({
  onView,
  onEdit,
  onDelete,
  t,
}: {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (role: Role) => void;
  t: any;
}): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("common:name", { defaultValue: "Name" })} />,
    cell: ({ row }) => (
      <span className="font-extrabold text-[#1e293b] text-[14px]">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "permissions",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("roles:permissions", { defaultValue: "Permissions" })} />,
    cell: ({ row }) => (
      <span className="text-xs text-slate-500">
        {row.original.permissions.length} {t("roles:permissionsCount", { defaultValue: "Permissions" })}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("common:status", { defaultValue: "Status" })} />,
    cell: ({ row }) => <StatusBadge active={row.original.isActive} />,
  },
  {
    id: "actions",
    header: t("common:actions", { defaultValue: "Actions" }),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <PermissionGuard permissions={["roles:view"]} fallback={null}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(row.original.id)}
            className="h-8 w-8 text-slate-400"
            title="View Role"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </PermissionGuard>
        <PermissionGuard permissions={["roles:update"]} fallback={null}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original.id)}
            className="h-8 w-8 text-slate-400"
            title="Edit Role"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </PermissionGuard>
        <PermissionGuard permissions={["roles:delete"]} fallback={null}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original)}
            className="h-8 w-8 text-red-400"
            title="Delete Role"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </PermissionGuard>
      </div>
    ),
  },
];
