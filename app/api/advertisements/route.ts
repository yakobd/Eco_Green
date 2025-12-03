import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole, getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    // For users, limit to 5 most recent ads
    const limit = session.role === 'USER' ? 5 : undefined;

    const advertisements = await prisma.advertisement.findMany({
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ advertisements });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const { message, productId } = await req.json();

    const advertisement = await prisma.advertisement.create({
      data: {
        message,
        productId,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({ advertisement });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
