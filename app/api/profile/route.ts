import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    const data = await req.json();

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        organizationName: data.organizationName,
        profileImage: data.profileImage,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        organizationName: true,
        profileImage: true,
        role: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
