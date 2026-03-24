import { AuditLogDetails } from "@/features/audit-logs/components/audit-log-details";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AuditLogDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return <AuditLogDetails id={id} />;
}
