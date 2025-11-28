import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      include: {
        orders: {
          include: {
            product: true,
          },
        },
      },
    });

    const organizations = users.map((user) => {
      const orders = user.orders;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + order.totalPrice, 0),
        pending: orders.filter((o) => o.status === 'PENDING').length,
        approved: orders.filter((o) => o.status === 'APPROVED').length,
        delivered: orders.filter((o) => o.status === 'DELIVERED').length,
      };
    });

    // Top products by organization
    const productStats: any = {};
    users.forEach((user) => {
      user.orders.forEach((order) => {
        const key = `${order.product.name}-${user.name}`;
        if (!productStats[key]) {
          productStats[key] = {
            product: order.product.name,
            organization: user.name,
            orders: 0,
            revenue: 0,
          };
        }
        productStats[key].orders++;
        productStats[key].revenue += order.totalPrice;
      });
    });

    const topProducts = Object.values(productStats)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    return NextResponse.json({
      organizations,
      topProducts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
