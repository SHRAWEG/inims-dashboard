import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { AuditLog, AuditLogListResponse, AuditLogQuery, AuditLogMetadata } from "../types/audit-log.types";

/**
 * Hook to fetch a paginated and filtered list of audit logs.
 */
export function useAuditLogs(query: AuditLogQuery = {}) {
  return useQuery({
    queryKey: ["audit-logs", query],
    queryFn: async () => {
      const response = await apiClient.get<AuditLogListResponse>(
        ENDPOINTS.AUDIT_LOGS.BASE,
        { params: query }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch details for a specific audit log entry.
 */
export function useAuditLog(id: string) {
  return useQuery({
    queryKey: ["audit-log", id],
    queryFn: async () => {
      const response = await apiClient.get<{ data: AuditLog }>(
        ENDPOINTS.AUDIT_LOGS.BY_ID(id)
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook to fetch audit log filter metadata (actions and resources).
 */
export function useAuditLogMetadata() {
  return useQuery({
    queryKey: ["audit-log-metadata"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: AuditLogMetadata }>(
        ENDPOINTS.AUDIT_LOGS.METADATA
      );
      return response.data.data;
    },
  });
}
