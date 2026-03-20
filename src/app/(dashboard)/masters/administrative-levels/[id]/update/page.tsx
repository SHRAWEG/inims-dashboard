import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function AdministrativeLevelUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordForm 
      id={id} 
      title="Administrative Level" 
      endpoint={ENDPOINTS.ADMINISTRATIVE_LEVELS.BASE} 
      mode="update" 
    />
  );
}
