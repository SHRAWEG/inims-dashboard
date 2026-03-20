import { MasterRecordDetails } from "@/features/masters";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function AgeGroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordDetails 
      title="Age Group" 
      endpoint={ENDPOINTS.AGE_GROUPS.BASE} 
      id={id} 
      basePath="/masters/age-groups"
    />
  );
}
