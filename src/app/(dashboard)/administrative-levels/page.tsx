import { MasterRecordManager } from '@/components/modules/master-record-manager';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function AdministrativeLevelsPage() {
  return <MasterRecordManager title="Administrative Levels" endpoint={ENDPOINTS.ADMINISTRATIVE_LEVELS.BASE} />;
}
