import { NextResponse } from "next/server";
import { getAuthUser } from "../../lib/auth";
import prisma from "../../lib/prisma";

export async function POST(request) {
  try {
    console.log('🚀 Start conversation API called');
    
    // Session kontrolü
    const session = await getAuthUser();
    if (!session) {
      console.log('❌ No session found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.log('✅ Session found:', session.id);

    const { recipientUsername } = await request.json();
    console.log('📝 Recipient username:', recipientUsername);

    if (!recipientUsername) {
      console.log('❌ No recipient username provided');
      return NextResponse.json(
        { error: "Recipient username is required" },
        { status: 400 }
      );
    }

    // Kullanıcıları bul
    console.log('🔍 Finding users...');
    const currentUser = await prisma.user.findUnique({
      where: { id: session.id },
    });

    const recipientUser = await prisma.user.findFirst({
      where: { user_name: recipientUsername },
    });

    console.log('👤 Current user:', currentUser?.user_name);
    console.log('👤 Recipient user:', recipientUser?.user_name);

    if (!currentUser) {
      console.log('❌ Current user not found');
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    if (!recipientUser) {
      console.log('❌ Recipient user not found');
      return NextResponse.json(
        { error: "Recipient user not found" },
        { status: 404 }
      );
    }

    // Kendi kendine mesaj atmasını engelle
    if (currentUser.id === recipientUser.id) {
      console.log('❌ User trying to message themselves');
      return NextResponse.json(
        { error: "Cannot start conversation with yourself" },
        { status: 400 }
      );
    }

    // Mevcut konuşma var mı kontrol et
    console.log('🔍 Checking for existing conversation...');
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { has: currentUser.id } },
          { participants: { has: recipientUser.id } }
        ]
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    console.log('🔍 Existing conversation found:', !!existingConversation);

    if (existingConversation) {
      console.log('✅ Returning existing conversation:', existingConversation.id);
      
      // Diğer kullanıcının bilgilerini getir (recipient user)
      const otherUser = {
        id: recipientUser.id,
        name: recipientUser.name,
        user_name: recipientUser.user_name,
        user_photo: recipientUser.user_photo,
        role: recipientUser.role
      };

      // Mevcut konuşmayı döndür
      return NextResponse.json({
        success: true,
        conversation: {
          id: existingConversation.id,
          otherUser,
          participants: [currentUser.id, recipientUser.id],
          lastMessage: existingConversation.messages[0]?.content || null,
          lastMessageAt: existingConversation.messages[0]?.createdAt || existingConversation.createdAt,
          unreadCount: 0,
        },
      });
    }

    // Yeni konuşma oluştur
    console.log('🆕 Creating new conversation...');
    const newConversation = await prisma.conversation.create({
      data: {
        participants: [currentUser.id, recipientUser.id],
      },
    });

    console.log('✅ New conversation created:', newConversation.id);

    // Diğer kullanıcının bilgilerini getir (recipient user)
    const otherUser = {
      id: recipientUser.id,
      name: recipientUser.name,
      user_name: recipientUser.user_name,
      user_photo: recipientUser.user_photo,
      role: recipientUser.role
    };

    return NextResponse.json({
      success: true,
      conversation: {
        id: newConversation.id,
        otherUser,
        participants: [currentUser.id, recipientUser.id],
        lastMessage: null,
        lastMessageAt: newConversation.createdAt,
        unreadCount: 0,
      },
    });

  } catch (error) {
    console.error("❌ Start conversation error:", error);
    console.error("❌ Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}