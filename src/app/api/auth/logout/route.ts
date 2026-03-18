import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('access_token')?.value;
    if (accessToken) {
      const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
      // Best effort backend logout
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }).catch(() => {});
    }
  } catch (error) {
    // Ignore error
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  
  return response;
}
