import { NextResponse } from "next/server";
import { getAuthUser } from "../../lib/auth";
import prisma from "../../lib/prisma";

export async function POST(request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { otherUserId } = await request.json();

    if (!otherUserId) {
      return NextResponse.json({ error: "Other user ID required" }, { status: 400 });
    }

    if (otherUserId === session.id) {
      return NextResponse.json({ error: "Cannot create conversation with yourself" }, { status: 400 });
    }

    console.log('Creating conversation between:', session.id, 'and', otherUserId);

    // Mevcut konuşma var mı kontrol et
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          hasEvery: [session.id, otherUserId]
        }
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true
          }
        }
      }
    });

    if (existingConversation) {
      // Mevcut konuşma varsa onu döndür
      const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: {
          id: true,
          name: true,
          user_name: true,
          user_photo: true,
          role: true
        }
      });

      return NextResponse.json({
        success: true,
        conversation: {
          id: existingConversation.id,
          otherUser,
          lastMessage: existingConversation.messages[0]?.content || null,
          lastMessageAt: existingConversation.messages[0]?.createdAt || existingConversation.createdAt,
          unreadCount: 0
        }
      });
    }

    // Yeni konuşma oluştur
    const newConversation = await prisma.conversation.create({
      data: {
        participants: [session.id, otherUserId]
      }
    });

    // Diğer kullanıcının bilgilerini al
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        name: true,
        user_name: true,
        user_photo: true,
        role: true
      }
    });

    console.log('New conversation created:', newConversation.id);

    return NextResponse.json({
      success: true,
      conversation: {
        id: newConversation.id,
        otherUser,
        lastMessage: null,
        lastMessageAt: newConversation.createdAt,
        unreadCount: 0
      }
    });

  } catch (error) {
    console.error('Konuşma oluşturma hatası:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
