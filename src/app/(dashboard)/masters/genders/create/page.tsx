import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default function CreateGenderPage() {
  return (
    <MasterRecordForm 
      title="Gender" 
      endpoint={ENDPOINTS.GENDERS.BASE} 
      mode="create" 
    />
  );
}
