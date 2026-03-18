import { MasterRecordManager } from '@/components/modules/master-record-manager';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function TypesPage() {
  return <MasterRecordManager title="Types" endpoint={ENDPOINTS.TYPES.BASE} />;
}
