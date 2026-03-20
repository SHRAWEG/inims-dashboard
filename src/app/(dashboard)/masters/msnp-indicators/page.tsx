"use client";

import { MasterRecordTable } from "@/features/masters";
import { getIndicatorColumns } from "@/features/masters/components/columns/indicator-columns";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useLocale } from "@/hooks/use-locale";

export default function MsnpIndicatorsPage() {
  const { locale } = useLocale();

  return (
    <MasterRecordTable 
      title="msnpIndicators" 
      endpoint={ENDPOINTS.MSNP_INDICATORS.BASE} 
      basePath="/masters/msnp-indicators" 
      columns={(handlers) => getIndicatorColumns(handlers)}
    />
  );
}
