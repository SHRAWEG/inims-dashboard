import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default function CreateAgeGroupPage() {
  return (
    <MasterRecordForm 
      title="Age Group" 
      endpoint={ENDPOINTS.AGE_GROUPS.BASE} 
      mode="create" 
    />
  );
}
