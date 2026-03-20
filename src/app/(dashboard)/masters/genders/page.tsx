"use client";

import { MasterRecordTable } from "@/features/masters";
import { getCommonColumns } from "@/features/masters/components/columns/common-columns";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useLocale } from "@/hooks/use-locale";

export default function GendersPage() {
  const { locale } = useLocale();

  return (
    <MasterRecordTable 
      title="genders" 
      endpoint={ENDPOINTS.GENDERS.BASE} 
      basePath="/masters/genders" 
      columns={(handlers) => getCommonColumns(handlers)}
    />
  );
}
