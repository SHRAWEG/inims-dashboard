import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default function CreateFrequencyPage() {
  return (
    <MasterRecordForm 
      title="Frequency" 
      endpoint={ENDPOINTS.FREQUENCIES.BASE} 
      mode="create" 
    />
  );
}
