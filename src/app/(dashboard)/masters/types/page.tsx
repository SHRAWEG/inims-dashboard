"use client";

import { MasterRecordTable } from "@/features/masters";
import { getCommonColumns } from "@/features/masters/components/columns/common-columns";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useLocale } from "@/hooks/use-locale";

export default function TypesPage() {
  const { locale } = useLocale();

  return (
    <MasterRecordTable 
      title="types" 
      endpoint={ENDPOINTS.TYPES.BASE} 
      basePath="/masters/types" 
      columns={(handlers) => getCommonColumns(handlers)}
    />
  );
}
