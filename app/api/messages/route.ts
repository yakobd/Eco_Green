import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let messages;
    if (userId) {
      // Get conversation with specific user
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.userId, receiverId: userId },
            { senderId: userId, receiverId: session.userId },
          ],
        },
        include: {
          sender: {
            select: { id: true, name: true, role: true },
          },
          receiver: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    } else {
      // Get all conversations
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.userId },
            { receiverId: session.userId },
          ],
        },
        include: {
          sender: {
            select: { id: true, name: true, role: true },
          },
          receiver: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { receiverId, message } = await req.json();

    const newMessage = await prisma.message.create({
      data: {
        senderId: session.userId,
        receiverId,
        message,
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
        receiver: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json({ message: newMessage });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
