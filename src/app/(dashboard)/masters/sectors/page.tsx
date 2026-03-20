"use client";

import { MasterRecordTable } from "@/features/masters";
import { getCommonColumns } from "@/features/masters/components/columns/common-columns";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useLocale } from "@/hooks/use-locale";

export default function SectorsPage() {
  const { locale } = useLocale();
  return (
    <MasterRecordTable 
      title="sectors" 
      endpoint={ENDPOINTS.SECTORS.BASE} 
      basePath="/masters/sectors" 
      columns={(handlers) => getCommonColumns(handlers)}
    />
  );
}
