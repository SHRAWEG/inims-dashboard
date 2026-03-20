import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function AgeGroupUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordForm 
      id={id} 
      title="Age Group" 
      endpoint={ENDPOINTS.AGE_GROUPS.BASE} 
      mode="update" 
    />
  );
}
