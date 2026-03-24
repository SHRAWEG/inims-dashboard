import { UserListWrapper } from '@/features/users/components/user-list-wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management | INIMS',
};

export default function UsersPage() {
  return <UserListWrapper />;
}
