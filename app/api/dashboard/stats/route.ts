import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await requireAuth();

    const [totalProducts, totalOrders, totalUsers, recentOrders] = await Promise.all([
      prisma.product.count(),
      session.role === 'USER'
        ? prisma.order.count({ where: { userId: session.userId } })
        : prisma.order.count(),
      session.role === 'SUPER_ADMIN' ? prisma.user.count() : null,
      prisma.order.findMany({
        where: session.role === 'USER' ? { userId: session.userId } : {},
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
        take: 5,
      }),
    ]);

    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: 'DELIVERED',
        ...(session.role === 'USER' ? { userId: session.userId } : {}),
      },
      _sum: {
        totalPrice: true,
      },
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentOrders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
