import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole, getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';

    const where: any = {};

    // Always filter by userId for regular users
    if (session.role === 'USER') {
      where.userId = session.userId;
    }

    if (status) {
      where.status = status;
    }

    console.log('Orders API - Session:', { role: session.role, userId: session.userId });
    console.log('Orders API - Where clause:', where);

    const orders = await prisma.order.findMany({
      where,
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Orders API - Found orders:', orders.length);

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { productId, quantity } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    const totalPrice = product.price * quantity;

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        productId,
        quantity,
        totalPrice,
        status: 'PENDING',
      },
      include: {
        product: true,
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
