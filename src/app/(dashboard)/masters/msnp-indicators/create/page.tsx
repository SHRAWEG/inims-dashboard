import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default function CreateMsnpIndicatorPage() {
  return (
    <MasterRecordForm 
      title="MSNP Indicator"
      endpoint={ENDPOINTS.MSNP_INDICATORS.BASE} 
      mode="create" 
    />
  );
}
