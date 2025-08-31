import { NextResponse } from "next/server";
import { getAuthUser } from "../../lib/auth";
import prisma from "../../lib/prisma";

export async function POST(request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, content, receiverId, messageType, packageData } = await request.json();

    if (!conversationId || !content || !content.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Engelleme kontrolü yap
    const isBlocked = await prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerUserId: session.id, blockedUserId: receiverId },
          { blockerUserId: receiverId, blockedUserId: session.id }
        ]
      }
    });

    if (isBlocked) {
      return NextResponse.json({ 
        error: "Bu kullanıcıya ulaşamazsınız. Kullanıcı engellenmiş olabilir." 
      }, { status: 403 });
    }

    // Mesajı veritabanına kaydet
    const messageData = {
      conversationId,
      senderId: session.id,
      content: content.trim(),
      messageType: messageType || 'TEXT'
    };

    // Eğer paket mesajı ise, packageData'yı JSON olarak kaydet
    if (messageType === 'PACKAGE' && packageData) {
      messageData.packageData = JSON.stringify(packageData);
    }

    const message = await prisma.message.create({
      data: messageData,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            user_photo: true
          }
        }
      }
    });

    // Eğer paket mesajı ise, packageData'yı parse et
    if (message.packageData) {
      message.packageData = JSON.parse(message.packageData);
    }

    // Conversation'ı güncelle
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content.trim(),
        lastMessageAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Socket.io ile gerçek zamanlı bildirim gönder
    const io = global.socketIO;
    if (io && receiverId) {
      // Conversation room'una emit et
      io.to(conversationId).emit('new_message', {
        ...message,
        conversationId,
        receiverId
      });
      
      // Ayrıca global olarak da emit et (conversation list güncellemesi için)
      io.emit('new_message', {
        ...message,
        conversationId,
        receiverId
      });
      
      console.log('📨 Mesaj Socket.io ile gönderildi:', message.id);
    }

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error("Message sending error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
