import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import { generateAccessToken, generateRefreshToken } from '@/app/lib/tokenUtils';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password, rememberMe = false } = await request.json();

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rememberMe);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieStore = await cookies();
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60
    });

    return NextResponse.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
