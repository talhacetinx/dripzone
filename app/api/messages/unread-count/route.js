import { NextResponse } from "next/server";
import { getAuthUser } from "../../lib/auth";
import prisma from "../../lib/prisma";

export async function GET() {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Kullanıcının tüm konuşmalarındaki okunmamış mesaj sayısını hesapla
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: session.id },
          { user2Id: session.id }
        ]
      },
      select: {
        id: true,
        unreadCount: true
      }
    });

    const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

    return NextResponse.json({
      success: true,
      count: totalUnreadCount
    });

  } catch (error) {
    console.error('Okunmamış mesaj sayısı getirme hatası:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
