import { MasterRecordManager } from '@/components/modules/master-record-manager';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function GendersPage() {
  return <MasterRecordManager title="Genders" endpoint={ENDPOINTS.GENDERS.BASE} />;
}
