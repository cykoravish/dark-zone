import { connectDB } from '@/lib/mongodb';
import ContactMessage from '@/lib/models/ContactMessage';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

function getAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const message = new ContactMessage({
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
      status: 'new',
    });

    await message.save();

    return NextResponse.json(
      { message: 'Message sent successfully', id: message._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
