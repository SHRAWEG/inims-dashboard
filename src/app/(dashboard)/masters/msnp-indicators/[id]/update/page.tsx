import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function MsnpIndicatorUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordForm 
      id={id} 
      title="MSNP Indicator"
      endpoint={ENDPOINTS.MSNP_INDICATORS.BASE} 
      mode="update" 
    />
  );
}
