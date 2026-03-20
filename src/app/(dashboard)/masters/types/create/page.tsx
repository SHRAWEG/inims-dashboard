import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default function CreateTypePage() {
  return (
    <MasterRecordForm 
      title="Type" 
      endpoint={ENDPOINTS.TYPES.BASE} 
      mode="create" 
    />
  );
}
