import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function GenderUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordForm 
      id={id} 
      title="Gender" 
      endpoint={ENDPOINTS.GENDERS.BASE} 
      mode="update" 
    />
  );
}
