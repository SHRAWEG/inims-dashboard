import { MasterRecordDetails } from "@/features/masters";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function AdministrativeLevelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordDetails 
      title="Administrative Level" 
      endpoint={ENDPOINTS.ADMINISTRATIVE_LEVELS.BASE} 
      id={id} 
      basePath="/masters/administrative-levels"
    />
  );
}
