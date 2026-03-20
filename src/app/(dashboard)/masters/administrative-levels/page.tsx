"use client";

import { MasterRecordTable } from "@/features/masters";
import { getCommonColumns } from "@/features/masters/components/columns/common-columns";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useLocale } from "@/hooks/use-locale";

export default function AdministrativeLevelsPage() {
  const { locale } = useLocale();
  return (
    <MasterRecordTable 
      title="administrativeLevels" 
      endpoint={ENDPOINTS.ADMINISTRATIVE_LEVELS.BASE} 
      basePath="/masters/administrative-levels" 
      columns={(handlers) => getCommonColumns(handlers)}
    />
  );
}
