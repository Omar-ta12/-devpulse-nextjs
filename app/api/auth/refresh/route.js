import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import { generateAccessToken } from '@/app/lib/tokenUtils';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('refreshToken');

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    const token = tokenCookie.value;

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    const accessToken = generateAccessToken(user);
    return NextResponse.json({ accessToken });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
  }
}
