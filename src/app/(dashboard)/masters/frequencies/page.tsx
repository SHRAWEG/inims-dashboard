"use client";

import { MasterRecordTable } from "@/features/masters";
import { getCommonColumns } from "@/features/masters/components/columns/common-columns";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useLocale } from "@/hooks/use-locale";

export default function FrequenciesPage() {
  const { locale } = useLocale();

  return (
    <MasterRecordTable 
      title="frequencies" 
      endpoint={ENDPOINTS.FREQUENCIES.BASE} 
      basePath="/masters/frequencies" 
      columns={(handlers) => getCommonColumns(handlers)}
    />
  );
}
