import { NextResponse } from 'next/server';
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

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // confirmation to user
    await transporter.sendMail({
      from: `"DevPulse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thanks for contacting us, ${name}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2>Hi ${name}, we got your message!</h2>
          <p>Thanks for reaching out. We'll get back to you at <strong>${email}</strong> soon.</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 13px;">Your message:</p>
            <p style="margin: 8px 0 0;">${message}</p>
          </div>
          <p style="color: #64748b; font-size: 13px;">— The DevPulse Team</p>
        </div>
      `
    });

    // notification to you
    await transporter.sendMail({
      from: `"DevPulse" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📬 New contact from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="margin: 0;">${message}</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
