"use client";

import { MasterRecordTable } from "@/features/masters";
import { getCommonColumns } from "@/features/masters/components/columns/common-columns";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useLocale } from "@/hooks/use-locale";

export default function AgeGroupsPage() {
  const { locale } = useLocale();

  return (
    <MasterRecordTable 
      title="ageGroups" 
      endpoint={ENDPOINTS.AGE_GROUPS.BASE} 
      basePath="/masters/age-groups" 
      columns={(handlers) => getCommonColumns(handlers)}
    />
  );
}
