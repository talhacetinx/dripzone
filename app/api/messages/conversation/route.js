import { NextResponse } from "next/server";
import { getAuthUser } from "../../lib/auth";
import prisma from "../../lib/prisma";

// Conversation oluştur veya getir
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

    // Kendi kendine mesaj göndermeyi engelle
    if (otherUserId === session.id) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }

    // Mevcut conversation'ı ara
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            AND: [
              { participants: { has: session.id } },
              { participants: { has: otherUserId } }
            ]
          }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                user_photo: true
              }
            }
          }
        }
      }
    });

    // Eğer conversation yoksa oluştur
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: [session.id, otherUserId]
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  user_photo: true
                }
              }
            }
          }
        }
      });
    }

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

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        participants: conversation.participants,
        otherUser
      },
      messages: conversation.messages
    });

  } catch (error) {
    console.error("Conversation creation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
