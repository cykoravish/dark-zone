import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { verifyToken } from '@/lib/auth';
import { sendOrderConfirmation } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

function getAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

function generateOrderNumber(): string {
  return 'ORD' + Date.now() + Math.random().toString(36).substring(7).toUpperCase();
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
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const orderNumber = generateOrderNumber();

    const order = new Order({
      orderNumber,
      customer: body.customer,
      items: body.items,
      totalAmount: body.totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    await order.save();

    // Send confirmation email
    try {
      await sendOrderConfirmation(
        body.customer.email,
        orderNumber,
        body.totalAmount,
        body.items
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json(
      { orderNumber, orderId: order._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
