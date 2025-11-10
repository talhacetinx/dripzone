import { NextResponse } from "next/server";
import { getAuthUser } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;

    // Konuşmanın bu kullanıcıya ait olduğunu doğrula
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          has: session.id
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Mesajları getir — performans için default olarak son N mesajı döndürelim
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')) : 200;

    // Prisma ile son N mesajı almak için önce createdAt desc ile al ve sonra tersine çevir
    let messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            user_photo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    messages = messages.reverse(); // kronolojik sıraya getir

    // Package data'yı parse et
    const parsedMessages = messages.map(message => {
      if (message.packageData) {
        try {
          message.packageData = JSON.parse(message.packageData);
        } catch (error) {
          console.error('Package data parse hatası:', error);
          message.packageData = null;
        }
      }
      return message;
    });

    return NextResponse.json({
      success: true,
      messages: parsedMessages
    });

  } catch (error) {
    console.error('Mesajları getirme hatası:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
