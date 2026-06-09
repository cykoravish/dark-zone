import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendOrderConfirmation } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderNumber, upiReference } = await req.json();

    if (!orderNumber || !upiReference) {
      return NextResponse.json(
        { error: 'Order number and UPI reference are required' },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update payment status
    order.paymentStatus = 'verified';
    order.orderStatus = 'confirmed';
    order.upiReference = upiReference;
    await order.save();

    // Send confirmation email
    try {
      await sendOrderConfirmation(
        order.customer.email,
        order.orderNumber,
        order.totalAmount,
        order.items
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return NextResponse.json({ message: 'Payment verified', order });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
