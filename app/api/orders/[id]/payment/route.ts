import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { paymentProof } = await req.json();

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { paymentProof },
      include: {
        product: true,
        user: true,
      },
    });

    // Notify admins/superadmins about payment upload
    // If the order is from a user, notify all admins and superadmins
    // If the order is from an admin, notify superadmins and other admins
    // If the order is from a superadmin, notify other superadmins and admins
    const notifyRoles = order.user.role === 'USER' 
      ? ['ADMIN', 'SUPER_ADMIN']
      : ['ADMIN', 'SUPER_ADMIN'];

    const admins = await prisma.user.findMany({
      where: {
        role: { in: notifyRoles },
        id: { not: session.userId }, // Don't notify the person who uploaded
      },
    });

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          orderId: order.id,
          type: 'PAYMENT_UPLOADED',
          title: 'Payment Proof Uploaded',
          message: `${order.user.name} (${order.user.role}) uploaded payment proof for order #${order.id.slice(-6)}`,
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
