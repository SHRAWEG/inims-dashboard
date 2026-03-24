"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, User as UserIcon, Activity, Database, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuditLog, AuditLogAction } from "../types/audit-log.types";
import { cn } from "@/lib/utils/cn";

const actionColorMap: Record<AuditLogAction, { bg: string; text: string }> = {
  CREATE: { bg: "bg-emerald-50", text: "text-emerald-700" },
  UPDATE: { bg: "bg-blue-50", text: "text-blue-700" },
  DELETE: { bg: "bg-red-50", text: "text-red-700" },
  LOGIN_SUCCESS: { bg: "bg-indigo-50", text: "text-indigo-700" },
  LOGIN_FAILURE: { bg: "bg-orange-50", text: "text-orange-700" },
  LOGOUT: { bg: "bg-slate-50", text: "text-slate-700" },
  PASSWORD_CHANGE: { bg: "bg-amber-50", text: "text-amber-700" },
  ROLE_ASSIGN: { bg: "bg-purple-50", text: "text-purple-700" },
  PERMISSION_CHANGE: { bg: "bg-cyan-50", text: "text-cyan-700" },
};

export const getAuditLogColumns = (
  onView: (log: AuditLog) => void
): ColumnDef<AuditLog>[] => [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const log = row.original;
      const userName = log.user 
        ? `${log.user.firstName} ${log.user.lastName}` 
        : "System";
      
      return (
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
            log.user ? "bg-slate-100 text-slate-500" : "bg-primary/10 text-primary"
          )}>
            {log.user ? userName.charAt(0) : <Activity className="h-4 w-4" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-700 truncate">{userName}</span>
            <span className="text-[10px] text-slate-400 font-medium truncate">
              {log.user?.email || "internal@system.inims"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as AuditLogAction;
      const colors = actionColorMap[action] || { bg: "bg-slate-50", text: "text-slate-600" };
      return (
        <Badge
          className={cn(
            "rounded-md px-2 py-0.5 text-[10px] uppercase font-black tracking-widest border-none shadow-none",
            colors.bg,
            colors.text
          )}
        >
          {action.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "resource",
    header: "Resource",
    cell: ({ row }) => {
      const resource = row.getValue("resource") as string;
      return (
        <div className="flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
            {resource || "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold">
            <Clock className="h-3.5 w-3.5 text-slate-300" />
            {format(date, "MMM d, yyyy")}
          </div>
          <span className="text-[10px] text-slate-400 font-medium pl-5.5">
            {format(date, "h:mm:ss a")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original;
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(log)}
          className="h-8 w-8 text-slate-400 hover:text-primary transition-colors"
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
