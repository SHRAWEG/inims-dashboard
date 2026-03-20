import { MasterRecordDetails } from "@/features/masters";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function FrequencyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordDetails 
      title="Frequency" 
      endpoint={ENDPOINTS.FREQUENCIES.BASE} 
      id={id} 
      basePath="/masters/frequencies"
    />
  );
}
