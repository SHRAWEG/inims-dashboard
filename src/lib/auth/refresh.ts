export async function refreshTokens(): Promise<void> {
  const res = await fetch('/api/auth/refresh', { method: 'POST' });
  if (!res.ok) throw new Error('Refresh failed');
}
