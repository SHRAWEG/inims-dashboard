import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    
    // Call the real backend login endpoint
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    const tokens = data?.data?.tokens || data?.data;
    
    if (res.ok && tokens?.accessToken) {
      const { accessToken, refreshToken } = tokens;
      const user = data?.data?.user || data?.data;

      const response = NextResponse.json({ success: true, user });

      // Note: Setting httpOnly: false so the browser apiClient (Axios) can read it 
      // to attach as a Bearer token to requests going directly to the external API.
      response.cookies.set('access_token', accessToken, {
        httpOnly: false, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      
      if (refreshToken) {
        response.cookies.set('refresh_token', refreshToken, {
          httpOnly: true, // Keep refresh token secure
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
      }

      return response;
    }

    return NextResponse.json(
      { success: false, error: data },
      { status: res.status }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Internal Server Error' } },
      { status: 500 }
    );
  }
}
