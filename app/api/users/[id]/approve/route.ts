import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['SUPER_ADMIN']);

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isApproved: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
      },
    });

    // Notify user of approval
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'ACCOUNT_APPROVED',
        title: 'Account Approved',
        message: 'Your account has been approved! You can now log in and access the platform.',
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
