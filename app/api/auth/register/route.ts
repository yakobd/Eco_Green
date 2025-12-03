import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, organizationName } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        organizationName,
        role: 'USER',
        isApproved: false,
      },
    });

    // Notify super admins about new registration
    const superAdmins = await prisma.user.findMany({
      where: { role: 'SUPER_ADMIN' },
    });

    for (const admin of superAdmins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'NEW_USER_REGISTRATION',
          title: 'New User Registration',
          message: `${user.name} from ${user.organizationName} has registered and is awaiting approval.`,
        },
      });
    }

    return NextResponse.json({
      message: 'Registration successful. Please wait for admin approval.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
