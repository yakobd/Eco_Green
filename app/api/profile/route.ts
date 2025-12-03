import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    const data = await req.json();

    console.log('Profile update request for user:', session.userId);
    console.log('Update data:', data);

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        organizationName: data.organizationName || null,
        profileImage: data.profileImage || null,
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

    console.log('Profile updated successfully:', user);
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
