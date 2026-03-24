import { RoleForm } from "@/features/roles";

interface UpdateRolePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateRolePage({ params }: UpdateRolePageProps) {
  const { id } = await params;
  return <RoleForm mode="update" id={id} />;
}
