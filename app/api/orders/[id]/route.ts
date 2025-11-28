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
      data: { status },
      include: {
        product: true,
        user: true,
      },
    });

    if (status === 'APPROVED') {
      await prisma.product.update({
        where: { id: order.productId },
        data: {
          quantity: {
            decrement: order.quantity,
          },
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
