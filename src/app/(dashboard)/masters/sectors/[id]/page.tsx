import { MasterRecordDetails } from "@/features/masters";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function SectorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MasterRecordDetails 
      title="Sector" 
      endpoint={ENDPOINTS.SECTORS.BASE} 
      id={id} 
      basePath="/masters/sectors"
    />
  );
}
