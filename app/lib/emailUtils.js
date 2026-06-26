import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: (process.env.EMAIL_PASS || '').replace(/\s/g, '')
  }
});

export const sendResetEmail = async (toEmail, resetURL) => {
  await transporter.sendMail({
    from: `"DevPulse" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #0f172a;">Reset your password</h2>
        <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
        <a href="${resetURL}" style="display:inline-block; padding: 12px 24px; background: #38bdf8; color: #0f172a; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
        <p style="margin-top: 16px; color: #64748b; font-size: 13px;">If you didn't request this, ignore this email.</p>
      </div>
    `
  });
};
