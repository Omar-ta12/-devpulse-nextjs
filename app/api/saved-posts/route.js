import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import SavedPost from '@/app/models/SavedPost';
import jwt from 'jsonwebtoken';

const getUserIdFromHeader = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
};

export async function GET(request) {
  try {
    const userId = getUserIdFromHeader(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const savedPosts = await SavedPost.find({ user: userId }).sort({ createdAt: -1 });
    return NextResponse.json(savedPosts);
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch saved posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userIdHeader = getUserIdFromHeader(request);
    if (!userIdHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { postId, title, body, userId } = await request.json();

    if (!postId || !title || !body) {
      return NextResponse.json({ message: 'postId, title and body are required' }, { status: 400 });
    }

    await connectDB();
    const saved = await SavedPost.create({
      user: userIdHeader,
      postId,
      title,
      body,
      userId,
    });
    
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ message: 'Post already saved' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to save post' }, { status: 500 });
  }
}
