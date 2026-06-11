import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { verifyToken } from '@/lib/auth';
import { sendOrderStatusUpdate } from '@/lib/email';
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
    const {id} = await params;
    const token = getAuthToken(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Fetch order error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: any
) {
  try {
     const {id} = await params;
    const token = getAuthToken(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    const order = await Order.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Send status update email
    if (body.orderStatus) {
      try {
        await sendOrderStatusUpdate(
          order.customer.email,
          order.orderNumber,
          body.orderStatus
        );
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
