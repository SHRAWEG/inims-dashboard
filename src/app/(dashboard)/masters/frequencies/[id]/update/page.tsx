import { MasterRecordForm } from "@/features/masters/components/master-record-form";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function FrequencyUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordForm 
      id={id} 
      title="Frequency" 
      endpoint={ENDPOINTS.FREQUENCIES.BASE} 
      mode="update" 
    />
  );
}
