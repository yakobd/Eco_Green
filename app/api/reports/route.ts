import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'daily';

    const now = new Date();
    let startDate = new Date();

    if (period === 'daily') {
      startDate.setDate(now.getDate() - 1);
    } else if (period === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'yearly') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        product: true,
        user: true,
      },
    });

    const totalRevenue = orders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.totalPrice, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
    const approvedOrders = orders.filter((o) => o.status === 'APPROVED').length;
    const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;

    return NextResponse.json({
      period,
      totalRevenue,
      totalOrders,
      pendingOrders,
      approvedOrders,
      deliveredOrders,
      orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
