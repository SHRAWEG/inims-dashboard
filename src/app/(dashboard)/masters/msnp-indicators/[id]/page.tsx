import { MasterRecordDetails } from "@/features/masters";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function MsnpIndicatorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordDetails 
      title="MSNP Indicator" 
      endpoint={ENDPOINTS.MSNP_INDICATORS.BASE} 
      id={id} 
      basePath="/masters/msnp-indicators"
    />
  );
}
