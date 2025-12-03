import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const { status } = await req.json();

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { 
        status,
        deliveryStatus: status === 'APPROVED' ? 'PENDING_PAYMENT' : 'NOT_SHIPPED'
      },
      include: {
        product: true,
        user: true,
      },
    });

    // Create notification for user
    let notifTitle = '';
    let notifMessage = '';
    let notifType = '';

    if (status === 'APPROVED') {
      notifType = 'ORDER_CONFIRMED';
      notifTitle = 'Order Confirmed';
      notifMessage = `Your order #${order.id.slice(-6)} for ${order.product.name} has been confirmed. Please complete payment to proceed.`;
    } else if (status === 'REJECTED') {
      notifType = 'ORDER_REJECTED';
      notifTitle = 'Order Declined';
      notifMessage = `Your order #${order.id.slice(-6)} for ${order.product.name} has been declined.`;
    }

    if (notifType) {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          type: notifType,
          title: notifTitle,
          message: notifMessage,
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
