import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: 'DELIVERED',
        deliveryStatus: 'DELIVERED',
      },
      include: {
        product: true,
        user: true,
      },
    });

    // Decrease stock when delivered
    await prisma.product.update({
      where: { id: order.productId },
      data: {
        quantity: {
          decrement: order.quantity,
        },
      },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        type: 'ORDER_DELIVERED',
        title: 'Order Delivered Successfully',
        message: `Your order #${order.id.slice(-6)} for ${order.product.name} has been delivered successfully! Thank you for your business.`,
      },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
