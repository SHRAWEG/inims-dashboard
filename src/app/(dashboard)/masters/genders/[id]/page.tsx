import { MasterRecordDetails } from "@/features/masters";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function GenderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordDetails 
      title="Gender" 
      endpoint={ENDPOINTS.GENDERS.BASE} 
      id={id} 
      basePath="/masters/genders"
    />
  );
}
