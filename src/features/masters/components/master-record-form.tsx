"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useMasterData } from "@/hooks/use-master-data";
import { handleApiError } from "@/lib/utils/error-handler";
import { apiClient } from "@/lib/api/client";
import { MasterRecord } from "@/types/api.types";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  commonMasterSchema,
  indicatorSchema,
  type IndicatorFormValues,
  type CommonMasterFormValues,
} from "../schemas/master.schemas";

type RecordFormValues = IndicatorFormValues | CommonMasterFormValues;

interface MasterRecordFormProps {
  title: string;
  endpoint: string;
  mode: "create" | "update";
  id?: string;
}

export function MasterRecordForm({
  title,
  endpoint,
  mode,
  id,
}: MasterRecordFormProps) {
  const { t } = useTranslation(["common", "masters"]);
  const router = useRouter();
  const isIndicator = title.toLowerCase().includes("indicator");

  const { createMutation, updateMutation } =
    useMasterData<MasterRecord>(endpoint);

  // Fetch record for update mode
  const { data: record, isLoading: isFetching } = useQuery({
    queryKey: [endpoint, id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get<any>(`${endpoint}/${id}`, {
        params: { withTranslations: true },
      });
      return (res.data?.data || res.data) as MasterRecord;
    },
    enabled: mode === "update" && !!id,
  });

  const schema = isIndicator ? indicatorSchema : commonMasterSchema;

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(schema) as any,
    mode: "onBlur",
    defaultValues: {
      name: { en: "", ne: "" },
      code: { en: "", ne: "" },
      isActive: true,
    },
  });

  // Reset form when record is fetched
  useEffect(() => {
    if (record) {
      const rec = record as any;
      form.reset({
        name: {
          en: rec.name?.en || rec.name || "",
          ne: rec.name?.ne || "",
        },
        code: {
          en: typeof rec.code === "string" ? rec.code : rec.code?.en || "",
          ne: typeof rec.code === "string" ? "" : rec.code?.ne || "",
        },
        isActive: rec.isActive,
      });
    }
  }, [record, form]);

  const onSubmit = async (data: RecordFormValues) => {
    try {
      if (mode === "update" && id) {
        await updateMutation.mutateAsync({ id, data });
        toast.success(t("saveSuccessful", { ns: "masters" }));
      } else {
        await createMutation.mutateAsync(data);
        toast.success(t("saveSuccessful", { ns: "masters" }));
      }
      router.back();
    } catch (error) {
      handleApiError(error, form.setError, t("error"));
    }
  };


  if (mode === "update" && isFetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completionPercentage = isIndicator
    ? (Object.keys(form.formState.dirtyFields).length / 5) * 100
    : (Object.keys(form.formState.dirtyFields).length / 2) * 100;

  return (
    <div className="space-y-8">
      {/* Header with Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title={
            mode === "create"
              ? `${t("create")} ${t(`${title}`, { ns: "masters" })}`
              : `${t("edit")} ${t(`${title}`, { ns: "masters" })}`
          }
          description={
            mode === "create"
              ? t("configureNew", {
                  ns: "masters",
                  item: t(`${title}.title`, { ns: "masters" }).toLowerCase(),
                })
              : t("updateExisting", {
                  ns: "masters",
                  item: t(`${title}.title`, { ns: "masters" }).toLowerCase(),
                })
          }
          showBackButton={true}
        />
      </div>
      {/* Main Form Section */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Code Section (Indicators only) */}
              {isIndicator && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-100 mb-2">
                  <FormField
                    control={form.control}
                    name="code.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          {t("codeEn", { ns: "masters" })}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., MSNP-001"
                            {...field}
                            className={cn(
                              "h-12 bg-white border-slate-200 focus:border-secondary transition-all",
                              (form.formState.errors as any).code?.en &&
                                "border-red-500",
                            )}
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
                        <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          {t("codeNe", { ns: "masters" })}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., MSNP-001"
                            {...field}
                            className={cn(
                              "h-12 bg-white border-slate-200 focus:border-secondary transition-all font-nepali",
                              (form.formState.errors as any).code?.ne &&
                                "border-red-500",
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Name Fields (Common) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t("nameEn", { ns: "masters" })}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter English name"
                          {...field}
                          className={cn(
                            "w-full px-4 py-3 bg-slate-50 border rounded-md focus:border-secondary focus:ring-0 focus-visible:ring-0 outline-none transition-all text-sm font-medium h-auto shadow-none",
                            (form.formState.errors as any).name?.en
                              ? "border-red-500 bg-red-50/10"
                              : "border-slate-200",
                          )}
                        />
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
                      <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t("nameNe", { ns: "masters" })}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="नेपाली नाम प्रविष्ट गर्नुहोस्"
                          {...field}
                          className={cn(
                            "w-full px-4 py-3 bg-slate-50 border rounded-md focus:border-secondary focus:ring-0 focus-visible:ring-0 outline-none transition-all text-sm font-medium font-nepali h-auto shadow-none",
                            (form.formState.errors as any).name?.ne
                              ? "border-red-500 bg-red-50/10"
                              : "border-slate-200",
                          )}
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
                  <FormItem className="flex flex-row items-center justify-between rounded-md border border-slate-100 p-4 bg-slate-50/50">
                    <div className="space-y-0.5">
                      <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("status")}
                      </FormLabel>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {field.value
                          ? t("activeStatusDesc", { ns: "masters" })
                          : t("inactiveStatusDesc", { ns: "masters" })}
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
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="px-6 h-11 rounded-md text-slate-600 font-bold text-sm hover:bg-slate-50"
              >
                {t("cancel")}
              </Button>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="px-10 h-11 rounded-md bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-sans"
                >
                  {t("save")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
