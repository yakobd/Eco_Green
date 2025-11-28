import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const orderId = searchParams.get('orderId');

    const where: any = {};
    if (productId) where.productId = productId;
    if (orderId) where.orderId = orderId;

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ comments });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { productId, orderId, comment } = await req.json();

    const newComment = await prisma.comment.create({
      data: {
        userId: session.userId,
        productId,
        orderId,
        comment,
      },
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json({ comment: newComment });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
