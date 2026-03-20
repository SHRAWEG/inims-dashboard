import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default function CreateAdministrativeLevelPage() {
  return (
    <MasterRecordForm 
      title="Administrative Level" 
      endpoint={ENDPOINTS.ADMINISTRATIVE_LEVELS.BASE} 
      mode="create" 
    />
  );
}
