import { cookies } from 'next/headers';

export interface Session {
  accessToken: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  if (!accessToken) return null;
  return { accessToken };
}
