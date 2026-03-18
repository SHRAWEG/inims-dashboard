import { MasterRecordManager } from '@/components/modules/master-record-manager';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function SectorsPage() {
  return <MasterRecordManager title="Sectors" endpoint={ENDPOINTS.SECTORS.BASE} />;
}
