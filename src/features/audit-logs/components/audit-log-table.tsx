"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { 
  Filter, 
  User as UserIcon, 
  Activity, 
  Database, 
  X, 
  ChevronDown, 
  Check, 
  Calendar as CalendarIcon,
  Hash
} from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuditLogs, useAuditLogMetadata } from "../hooks/use-audit-logs";
import { getAuditLogColumns } from "./audit-log-columns";
import { AuditLogQuery } from "../types/audit-log.types";
import { useUsers } from "@/features/users/hooks/use-users";
import { cn } from "@/lib/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export function AuditLogTable() {
  const { t } = useTranslation(["common", "audit-logs"]);
  const router = useRouter();
  
  // Data Fetching
  const { data: users = [] } = useUsers();
  const { data: metadata, isLoading: isMetadataLoading } = useAuditLogMetadata();
  const [filters, setFilters] = useState<AuditLogQuery>({
    page: 1,
    limit: 10,
  });

  // UI State for Comboboxes
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [resourceDropdownOpen, setResourceDropdownOpen] = useState(false);

  const { data, isLoading: isTableLoading } = useAuditLogs(filters);

  const columns = getAuditLogColumns((log) => {
    router.push(`/audit-logs/${log.id}`);
  });

  const handleFilterChange = (key: keyof AuditLogQuery, value: any) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value, page: 1 };
      // Clear resourceId if resource is cleared
      if (key === "resource" && !value) {
        delete next.resourceId;
      }
      return next;
    });
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const hasExtraFilters = filters.userId || filters.action || filters.resource || filters.startDate || filters.endDate || filters.resourceId;
  const selectedUser = users.find(u => u.id === filters.userId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("audit-logs:title", { defaultValue: "Audit Logs" })}
        description={t("audit-logs:description", { defaultValue: "Track system activity and data changes across the platform" })}
      />

      {/* Advanced Filters Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-300">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                {t("common:filterWorkspace", { defaultValue: "Search & Filters" })}
              </h3>
            </div>
            {hasExtraFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-8 text-[10px] font-black text-slate-400 hover:text-red-500 transition-all uppercase tracking-widest hover:bg-red-50"
              >
                <X className="h-3 w-3 mr-1.5" />
                {t("common:clearFilters", { defaultValue: "Reset Filters" })}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* User Dropdown */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                {t("audit-logs:performer", { defaultValue: "Performed By" })}
              </label>
              <Popover open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between h-10 bg-slate-50/50 border-slate-100 hover:bg-white transition-all text-xs text-slate-600 font-medium",
                      !filters.userId && "text-slate-400"
                    )}
                  >
                     <div className="flex items-center gap-2 truncate">
                        <UserIcon className="h-4 w-4 shrink-0 text-slate-300" />
                        {filters.userId ? `${selectedUser?.firstName} ${selectedUser?.lastName}` : "Select Performer"}
                     </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                  <Command className="border-none">
                    <CommandInput placeholder="Search user..." className="h-9 border-none focus:ring-0" />
                    <CommandList className="max-h-64 no-scrollbar">
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all-users"
                          onSelect={() => {
                            handleFilterChange("userId", undefined);
                            setUserDropdownOpen(false);
                          }}
                          className="text-xs"
                        >
                          <Check className={cn("mr-2 h-4 w-4", !filters.userId ? "opacity-100" : "opacity-0")} />
                          All Users
                        </CommandItem>
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.firstName} ${user.lastName} ${user.email}`}
                            onSelect={() => {
                              handleFilterChange("userId", user.id);
                              setUserDropdownOpen(false);
                            }}
                            className="text-xs cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 text-primary",
                                filters.userId === user.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {user.firstName} {user.lastName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Action Dropdown (Dynamic) */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                {t("audit-logs:action", { defaultValue: "Action Type" })}
              </label>
              <Popover open={actionDropdownOpen} onOpenChange={setActionDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between h-10 bg-slate-50/50 border-slate-100 hover:bg-white transition-all text-xs text-slate-600 font-medium",
                      !filters.action && "text-slate-400"
                    )}
                  >
                     <div className="flex items-center gap-2 truncate">
                        <Activity className="h-4 w-4 shrink-0 text-slate-300" />
                        {filters.action ? filters.action.replace("_", " ") : "Select Action"}
                     </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search action..." className="h-9" />
                    <CommandList className="max-h-64 no-scrollbar">
                      <CommandEmpty>No actions found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            handleFilterChange("action", undefined);
                            setActionDropdownOpen(false);
                          }}
                          className="text-xs"
                        >
                          <Check className={cn("mr-2 h-4 w-4", !filters.action ? "opacity-100" : "opacity-0")} />
                          All Actions
                        </CommandItem>
                        {metadata?.actions.map((action) => (
                          <CommandItem
                            key={action}
                            value={action}
                            onSelect={() => {
                              handleFilterChange("action", action);
                              setActionDropdownOpen(false);
                            }}
                            className="text-xs cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 text-primary",
                                filters.action === action ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {action.replace("_", " ")}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Resource Dropdown (Dynamic) */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                {t("audit-logs:resource", { defaultValue: "Target Resource" })}
              </label>
              <Popover open={resourceDropdownOpen} onOpenChange={setResourceDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between h-10 bg-slate-50/50 border-slate-100 hover:bg-white transition-all text-xs text-slate-600 font-medium",
                      !filters.resource && "text-slate-400"
                    )}
                  >
                     <div className="flex items-center gap-2 truncate">
                        <Database className="h-4 w-4 shrink-0 text-slate-300" />
                        {filters.resource ? filters.resource.toUpperCase() : "Select Resource"}
                     </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search resource..." className="h-9" />
                    <CommandList className="max-h-64 no-scrollbar">
                      <CommandEmpty>No resources found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            handleFilterChange("resource", undefined);
                            setResourceDropdownOpen(false);
                          }}
                          className="text-xs"
                        >
                          <Check className={cn("mr-2 h-4 w-4", !filters.resource ? "opacity-100" : "opacity-0")} />
                          All Resources
                        </CommandItem>
                        {metadata?.resources.map((resource) => (
                          <CommandItem
                            key={resource}
                            value={resource}
                            onSelect={() => {
                              handleFilterChange("resource", resource);
                              setResourceDropdownOpen(false);
                            }}
                            className="text-xs cursor-pointer capitalize"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 text-primary",
                                filters.resource === resource ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {resource}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date From */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                 {t("audit-logs:startDate", { defaultValue: "From Date" })}
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-300 pointer-events-none" />
                <input 
                   type="date"
                   className="w-full h-10 pl-9 pr-3 bg-slate-50/50 border border-slate-100 rounded-md text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/20 hover:bg-white transition-all cursor-pointer"
                   value={filters.startDate || ""}
                   onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>
            </div>

            {/* Date To */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                 {t("audit-logs:endDate", { defaultValue: "To Date" })}
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-300 pointer-events-none" />
                <input 
                   type="date"
                   className="w-full h-10 pl-9 pr-3 bg-slate-50/50 border border-slate-100 rounded-md text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/20 hover:bg-white transition-all cursor-pointer"
                   value={filters.endDate || ""}
                   onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>
            </div>

            {/* Conditional Resource ID (UUID) */}
            {filters.resource && (
               <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                    {t("audit-logs:resourceId", { defaultValue: "Target UUID" })}
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-300 pointer-events-none" />
                    <Input 
                      placeholder="e.g. 36a99194..."
                      className="h-10 pl-9 bg-slate-50/50 border-slate-100 text-xs font-medium text-slate-600 focus:bg-white transition-all"
                      value={filters.resourceId || ""}
                      onChange={(e) => handleFilterChange("resourceId", e.target.value)}
                    />
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns as any}
          data={data?.data || []}
          isLoading={isTableLoading || isMetadataLoading}
          pageCount={data?.meta?.totalPages || 0}
          pagination={{
            pageIndex: (filters.page || 1) - 1,
            pageSize: filters.limit || 10,
          }}
          onPaginationChange={(p: any) => {
            const newPagination = typeof p === 'function' ? p({ pageIndex: (filters.page || 1) - 1, pageSize: filters.limit }) : p;
            setFilters(prev => ({ 
              ...prev, 
              page: newPagination.pageIndex + 1,
              limit: newPagination.pageSize
            }));
          }}
          rowCount={data?.meta?.total || 0}
        />
      </div>
    </div>
  );
}
