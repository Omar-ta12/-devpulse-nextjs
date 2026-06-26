import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import { generateAccessToken, generateRefreshToken } from '@/app/lib/tokenUtils';

const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
  return null;
};

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ message: passwordError }, { status: 400 });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    const user = await User.create({ name, email, password });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, false);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieStore = await cookies();
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60
    });

    return NextResponse.json(
      {
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
