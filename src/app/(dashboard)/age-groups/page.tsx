import { MasterRecordManager } from '@/components/modules/master-record-manager';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function AgeGroupsPage() {
  return <MasterRecordManager title="Age Groups" endpoint={ENDPOINTS.AGE_GROUPS.BASE} />;
}
