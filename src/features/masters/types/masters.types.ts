import { LocalizedField } from '@/types/i18n.types';

export interface BaseMasterRecord {
  id: string;
  name: LocalizedField | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SectorRecord extends BaseMasterRecord {}

export interface IndicatorRecord extends BaseMasterRecord {
  code: LocalizedField | string;
  sectorId: string;
  sector?: SectorRecord;
  description?: LocalizedField | string;
}

export interface AdministrativeLevelRecord extends BaseMasterRecord {}

export interface FrequencyRecord extends BaseMasterRecord {}

export interface GenderRecord extends BaseMasterRecord {}

export interface AgeGroupRecord extends BaseMasterRecord {}

export interface MasterTypeRecord extends BaseMasterRecord {}
