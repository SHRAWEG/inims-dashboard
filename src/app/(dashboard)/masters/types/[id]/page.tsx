import { MasterRecordDetails } from "@/features/masters";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function TypeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordDetails 
      title="Type" 
      endpoint={ENDPOINTS.TYPES.BASE} 
      id={id} 
      basePath="/masters/types"
    />
  );
}
