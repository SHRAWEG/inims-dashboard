import { MasterRecordForm } from "@/features/masters";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default function CreateSectorPage() {
  return (
    <MasterRecordForm 
      title="Sector" 
      endpoint={ENDPOINTS.SECTORS.BASE} 
      mode="create" 
    />
  );
}
