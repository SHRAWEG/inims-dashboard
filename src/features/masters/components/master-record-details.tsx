"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Edit, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

import { apiClient } from "@/lib/api/client";
import { MasterRecord } from "@/types/api.types";
import { useLocale } from "@/hooks/use-locale";
import { formatDateTime } from "@/lib/utils/format";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";

interface MasterRecordDetailsProps {
  title: string;
  endpoint: string;
  id: string;
  basePath: string;
}

export function MasterRecordDetails({
  title,
  endpoint,
  id,
  basePath,
}: MasterRecordDetailsProps) {
  const { t } = useTranslation(["common", "masters"]);
  const { locale } = useLocale();
  const router = useRouter();
  const isIndicator = title.toLowerCase().includes("indicator");

  const { data: record, isLoading } = useQuery({
    queryKey: [endpoint, id],
    queryFn: async () => {
      const res = await apiClient.get<any>(`${endpoint}/${id}`, {
        params: { withTranslations: true },
      });
      return (res.data?.data || res.data) as MasterRecord;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <XCircle className="h-8 w-8 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Record not found
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          The record you are looking for might have been deleted or moved.
        </p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-8 px-8 font-bold text-slate-600"
        >
          Go back to list
        </Button>
      </div>
    );
  }

  const rec = record as any;
  const nameObj = rec.name as any;
  const displayName =
    typeof nameObj === "string"
      ? nameObj
      : nameObj?.[locale] || nameObj?.en || "";

  return (
    <div className="space-y-8">
      {/* Header with Edit Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title={t(`${title}.title`, { ns: "masters" })}
          description={t("detailedConfig", { ns: "masters", item: t(`${title}.title`, { ns: "masters" }).toLowerCase() })}
          showBackButton={true}
          actions={
            <Button
              onClick={() => router.push(`${basePath}/${id}/update`)}
              className="gap-2 bg-secondary hover:bg-secondary/90 shadow-md shadow-secondary/10 h-10 px-6 font-bold"
            >
              <Edit className="h-4 w-4" />
              {t("edit")}
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-12 gap-6 pb-20">
        {/* Main Content Areas */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Bento Card: Identification */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">
              {t("identification", { ns: "masters" })}
            </h3>
            {isIndicator && rec.code && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200 self-start uppercase tracking-wider font-mono">
                  {t("codeEn", { ns: "masters" })}:{" "}
                  {typeof rec.code === "string" ? rec.code : rec.code?.en}
                </div>
                {typeof rec.code !== "string" && rec.code?.ne && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200 self-start uppercase tracking-wider font-mono">
                    {t("codeNe", { ns: "masters" })}:{" "}
                    <span className="font-nepali">{rec.code.ne}</span>
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {t("nameEn", { ns: "masters" })}
                </label>
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  {nameObj?.en || rec.name || "-"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {t("nameNe", { ns: "masters" })}
                </label>
                <p className="text-lg font-bold text-slate-900 leading-tight font-nepali">
                  {nameObj?.ne || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Status Bento Card */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">
              {t("systemStatus", { ns: "masters" })}
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {t("visibility", { ns: "masters" })}
                  </span>
                  <StatusBadge active={rec.isActive} />
                </div>
                <div
                  className={
                    rec.isActive
                      ? "bg-green-100 p-2 rounded-full"
                      : "bg-red-100 p-2 rounded-full"
                  }
                >
                  {rec.isActive ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </div>
            {/* Background design */}
            <div
              className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 ${rec.isActive ? "bg-green-600" : "bg-red-600"}`}
            ></div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">
              {t("metadata", { ns: "masters" })}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-50 rounded-md flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">
                    {t("createdAt", { ns: "masters" })}
                  </label>
                  <p className="text-xs font-medium text-slate-700">
                    {formatDateTime(rec.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-orange-50 rounded-md flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">
                    {t("updatedAtLabel", { ns: "masters" })}
                  </label>
                  <p className="text-xs font-medium text-slate-700">
                    {formatDateTime(rec.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-slate-900 p-6 rounded-lg shadow-lg relative overflow-hidden text-white">
            <div className="relative z-10">
              <h3 className="font-bold text-sm mb-2">Need to adjust?</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                You can update the naming and status of this record. Historical
                data will be preserved.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`${basePath}/${id}/update`)}
                className="w-full bg-transparent border-slate-700 text-white hover:bg-white hover:text-slate-900 font-bold transition-all text-xs rounded-md"
              >
                Launch Editor
              </Button>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
