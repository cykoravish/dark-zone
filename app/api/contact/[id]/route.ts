import { connectDB } from '@/lib/mongodb';
import ContactMessage from '@/lib/models/ContactMessage';
import { verifyToken } from '@/lib/auth';
import { sendContactReply } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

function getAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = await params;
    const token = getAuthToken(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const message = await ContactMessage.findById(id);

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Mark as read
    if (message.status === 'new') {
      message.status = 'read';
      await message.save();
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Fetch message error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: any
) {
  const {id} = await params;
  try {
    const token = getAuthToken(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { adminReply: body.adminReply, status: 'replied' },
      { new: true }
    );

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Send reply email
    if (body.adminReply) {
      try {
        await sendContactReply(
          message.email,
          message.name,
          body.adminReply
        );
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
