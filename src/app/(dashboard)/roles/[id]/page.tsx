import { RoleDetails } from "@/features/roles/components/role-details";

interface RolePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RolePage({ params }: RolePageProps) {
  const { id } = await params;
  return <RoleDetails id={id} />;
}
