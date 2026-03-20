import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function UpdateTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordForm 
      id={id} 
      title="Type" 
      endpoint={ENDPOINTS.TYPES.BASE} 
      mode="update" 
    />
  );
}
