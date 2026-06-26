import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import crypto from 'crypto';
import { sendResetEmail } from '@/app/lib/emailUtils';

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'No account with that email' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = expiry;
    await user.save({ validateBeforeSave: false });

    // Use FRONTEND_URL or default to localhost for dev
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
    const resetURL = `${frontendUrl}/reset-password/${resetToken}`;
    
    await sendResetEmail(email, resetURL);

    return NextResponse.json({ message: 'Reset link sent to your email' });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
