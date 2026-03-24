"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/auth.types";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils/cn";
import { PermissionGuard } from "@/components/common/PermissionGuard";

export const createUserColumns = (
  onView: (user: User) => void,
  onEdit: (user: User) => void,
  onDelete: (user: User) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "firstName",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700">{`${user.firstName} ${user.lastName}`}</span>
          <span className="text-xs text-slate-400 font-medium">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "roleName",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      const isSystemRole = !!user.systemRole;
      return (
        <div className="flex items-center gap-2">
          {isSystemRole ? (
            <Shield className="w-3.5 h-3.5 text-primary" />
          ) : (
            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className={isSystemRole ? "font-bold text-primary" : "font-medium text-slate-600"}>
            {user.roleName || "No Role"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={cn(
            "rounded-full px-3 py-0.5 text-[10px] uppercase font-bold tracking-wider",
            isActive ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      return (
        <span className="text-slate-500 font-medium">
          {createdAt ? format(new Date(createdAt as string), "MMM d, yyyy") : "-"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-1">
          <PermissionGuard permissions={["users:view"]} fallback={null}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(user)}
              className="h-8 w-8 text-slate-400"
              title="View User"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </PermissionGuard>
          <PermissionGuard permissions={["users:update"]} fallback={null}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(user)}
              className="h-8 w-8 text-slate-400"
              title="Edit User"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </PermissionGuard>
          <PermissionGuard permissions={["users:delete"]} fallback={null}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(user)}
              className="h-8 w-8 text-red-400"
              title="Delete User"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </PermissionGuard>
        </div>
      );
    },
  },
];
