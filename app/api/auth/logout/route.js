import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieStore = await cookies();
  
  cookieStore.set('refreshToken', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 0 // Expire immediately
  });

  return NextResponse.json({ message: 'Logged out' });
}
