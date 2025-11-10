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

    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')) : 50;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          has: session.id
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: limit,
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
    // Batch fetch all other user profiles to avoid N+1 DB calls
    const otherUserIds = conversations.map(conv => conv.participants.find(id => id !== session.id)).filter(Boolean);
    const uniqueOtherUserIds = Array.from(new Set(otherUserIds));

    const otherUsers = uniqueOtherUserIds.length > 0 ? await prisma.user.findMany({
      where: { id: { in: uniqueOtherUserIds } },
      select: { id: true, name: true, user_name: true, user_photo: true, role: true }
    }) : [];

    const otherUserById = otherUsers.reduce((acc, u) => { acc[u.id] = u; return acc; }, {});

    const formattedConversations = conversations.map((conv) => {
      const otherUserId = conv.participants.find(id => id !== session.id);
      const otherUser = otherUserById[otherUserId] || null;
      const lastMessage = conv.messages[0]?.content || null;
      const lastMessageAt = conv.messages[0]?.createdAt || conv.createdAt;

      return {
        id: conv.id,
        otherUser,
        lastMessage,
        lastMessageAt,
        unreadCount: 0
      };
    });

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
