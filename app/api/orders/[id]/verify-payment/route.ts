import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const { action } = await req.json(); // 'approve' or 'reject'

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        paymentVerified: action === 'approve',
        deliveryStatus: action === 'approve' ? 'DELIVERY_IN_PROGRESS' : 'PAYMENT_REJECTED',
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
      },
      include: {
        product: true,
        user: true,
      },
    });

    // Notify the order owner (user, admin, or superadmin)
    if (action === 'approve') {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          type: 'PAYMENT_VERIFIED',
          title: 'Payment Verified - Delivery in Progress',
          message: `Your payment for order #${order.id.slice(-6)} has been verified. Your order is being processed and will be shipped soon!`,
        },
      });
    } else {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          type: 'PAYMENT_REJECTED',
          title: 'Payment Rejected',
          message: `Your payment for order #${order.id.slice(-6)} was rejected. Please contact support or upload a valid payment proof.`,
        },
      });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
