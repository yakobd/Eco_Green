import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const data = await req.json();

    const product = await prisma.product.create({
      data,
    });

    await prisma.advertisement.create({
      data: {
        message: `New product available: ${product.name}`,
        productId: product.id,
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
