export type AuditLogAction = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'LOGIN_SUCCESS' 
  | 'LOGIN_FAILURE' 
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'ROLE_ASSIGN'
  | 'PERMISSION_CHANGE';

export interface AuditLog {
  id: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    systemRole: string;
  };
  action: AuditLogAction;
  resource: string;
  resourceId?: string;
  before?: any;
  after?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditLogListResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuditLogMetadata {
  actions: string[];
  resources: string[];
}
