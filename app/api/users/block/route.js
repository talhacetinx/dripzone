import { NextResponse } from 'next/server';
import { getAuthUser } from '../../lib/auth';
import prisma from '../../lib/prisma';

// Kullanıcı engelleme
export async function POST(request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { blockedUserId } = await request.json();

    if (!blockedUserId) {
      return NextResponse.json({ error: 'Blocked user ID is required' }, { status: 400 });
    }

    // Kendini engellemeyi önle
    if (session.id === blockedUserId) {
      return NextResponse.json({ error: 'Kendinizi engelleyemezsiniz' }, { status: 400 });
    }

    // Zaten engellenmiş mi kontrol et
    const existingBlock = await prisma.userBlock.findFirst({
      where: {
        blockerUserId: session.id,
        blockedUserId: blockedUserId
      }
    });

    if (existingBlock) {
      return NextResponse.json({ error: 'Bu kullanıcı zaten engellenmiş' }, { status: 400 });
    }

    await prisma.userBlock.create({
      data: {
        blockerUserId: session.id,
        blockedUserId: blockedUserId
      }
    });

    await prisma.conversation.updateMany({
      where: {
        participants: {
          hasEvery: [session.id, blockedUserId]
        }
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla engellendi'
    });

  } catch (error) {
    console.error('User blocking error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { blockedUserId } = await request.json();

    if (!blockedUserId) {
      return NextResponse.json({ error: 'Blocked user ID is required' }, { status: 400 });
    }

    await prisma.userBlock.deleteMany({
      where: {
        blockerUserId: session.id,
        blockedUserId: blockedUserId
      }
    });

    // Konuşmaları tekrar aktif et
    await prisma.conversation.updateMany({
      where: {
        participants: {
          hasEvery: [session.id, blockedUserId]
        }
      },
      data: {
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı engeli kaldırıldı'
    });

  } catch (error) {
    console.error('User unblocking error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
