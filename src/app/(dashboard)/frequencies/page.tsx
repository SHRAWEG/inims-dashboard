import { MasterRecordManager } from '@/components/modules/master-record-manager';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function FrequenciesPage() {
  return <MasterRecordManager title="Frequencies" endpoint={ENDPOINTS.FREQUENCIES.BASE} />;
}
