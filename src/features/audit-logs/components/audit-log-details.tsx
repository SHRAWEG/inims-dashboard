"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  History, 
  ArrowRight, 
  User as UserIcon, 
  Database, 
  Globe, 
  Monitor, 
  Clock 
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { useAuditLog } from "../hooks/use-audit-logs";
import { Badge } from "@/components/ui/badge";

interface AuditLogDetailsProps {
  id: string;
}

export function AuditLogDetails({ id }: AuditLogDetailsProps) {
  const { t } = useTranslation(["common", "audit-logs"]);
  const { data: log, isLoading } = useAuditLog(id);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="text-center py-20 bg-white rounded-lg border border-slate-100 shadow-sm">
        <History className="h-12 w-12 text-slate-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          {t("audit-logs:logNotFound", { defaultValue: "Audit log entry not found" })}
        </h2>
      </div>
    );
  }

  const renderJson = (data: any) => {
    if (!data) return <span className="text-slate-400 italic font-medium">None</span>;
    return (
      <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl text-xs overflow-auto font-mono leading-relaxed max-h-[400px] shadow-inner">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        title={`${t("audit-logs:logEntry", { defaultValue: "Log Entry" })} #${id.slice(0, 8)}`}
        description={t("audit-logs:logDetailDesc", { defaultValue: "Examine detailed record of this specific system event" })}
        showBackButton
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Meta Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
               {t("audit-logs:eventSummary", { defaultValue: "Event Summary" })}
            </h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{t("common:action")}</span>
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-2.5">
                  {log.action.replace("_", " ")}
                </Badge>
              </div>

               <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                       <UserIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <header className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("audit-logs:performedBy")}</header>
                      <p className="text-sm font-bold text-slate-800">
                        {log.user ? `${log.user.firstName} ${log.user.lastName}` : "System Action"}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {log.user?.email || "Executed by internal system process"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                       <Database className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <header className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("audit-logs:targetResource")}</header>
                      <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{log.resource}</p>
                      <p className="text-[10px] font-mono font-medium text-slate-400">{log.resourceId}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                       <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <header className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("common:timestamp")}</header>
                      <p className="text-sm font-bold text-slate-800">{format(new Date(log.createdAt), "MMMM d, yyyy")}</p>
                      <p className="text-xs font-medium text-slate-500">{format(new Date(log.createdAt), "h:mm:ss a")}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
               {t("audit-logs:origin", { defaultValue: "Request Context" })}
            </h4>
             <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-slate-300" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">IP Address</span>
                    <span className="text-xs font-bold text-slate-600 font-mono tracking-tight">{log.ipAddress || "Unknown"}</span>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <Monitor className="h-4 w-4 text-slate-300 mt-1" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">User Agent</span>
                    <span className="text-xs font-medium text-slate-500 line-clamp-2 italic">{log.userAgent || "Unknown"}</span>
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* JSON Diff Card */}
        <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
            <div className="p-8">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                 <History className="h-4 w-4 text-primary" />
                 {t("audit-logs:dataChanges", { defaultValue: "Data State Comparison" })}
               </h4>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pl-1">
                       <span className="h-2 w-2 rounded-full bg-red-400" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("audit-logs:before", { defaultValue: "Previous State" })}</span>
                    </div>
                    {renderJson(log.before)}
                  </div>

                  <div className="relative space-y-4">
                     {/* Overlay arrow for desktop */}
                    <div className="hidden md:flex absolute -left-7 top-[calc(50%+12px)] h-6 w-6 rounded-full bg-slate-100 items-center justify-center border border-slate-200 text-slate-400 z-10 shadow-sm">
                      <ArrowRight className="h-3 w-3" />
                    </div>

                    <div className="flex items-center gap-2 pl-1">
                       <span className="h-2 w-2 rounded-full bg-emerald-400" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("audit-logs:after", { defaultValue: "New State" })}</span>
                    </div>
                    {renderJson(log.after)}
                  </div>
               </div>
            </div>
            <div className="p-6 bg-slate-50/50">
               <p className="text-[10px] font-medium text-slate-400 leading-relaxed max-w-lg">
                 Note: State snapshots captured at the exact moment of execution. Sensitive fields like passwords and tokens are automatically redacted by the system before storage.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
