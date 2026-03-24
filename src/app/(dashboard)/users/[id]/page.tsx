import { UserDetails } from "@/features/users/components/user-details";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  return <UserDetails id={id} />;
}
