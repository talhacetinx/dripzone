import { NextResponse } from "next/server";
import { getAuthUser } from "../../lib/auth";
import prisma from "../../lib/prisma";

// Kullanıcının tüm konuşmalarını getir
export async function GET(request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('Conversations API - User ID:', session.id);

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          has: session.id
        }
      },
      orderBy: {
        updatedAt: 'desc'
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

    console.log('Found conversations:', conversations.length);

    // Konuşmaları frontend için format et
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        // Diğer kullanıcının ID'sini bul
        const otherUserId = conv.participants.find(id => id !== session.id);
        
        // Diğer kullanıcının bilgilerini getir
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

        const lastMessage = conv.messages[0]?.content || null;
        const lastMessageAt = conv.messages[0]?.createdAt || conv.createdAt;
        
        return {
          id: conv.id,
          otherUser,
          lastMessage,
          lastMessageAt,
          unreadCount: 0 
        };
      })
    );

    console.log('Formatted conversations:', formattedConversations.length);

    return NextResponse.json({
      success: true,
      conversations: formattedConversations
    });

  } catch (error) {
    console.error('Konuşmaları getirme hatası:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
