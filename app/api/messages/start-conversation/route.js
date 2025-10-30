import { NextResponse } from 'next/server'
import { getAuthUser } from '../../lib/auth'
import prisma from '../../lib/prisma'

export async function POST(req) {
  try {
    const session = await getAuthUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { recipientUsername } = body
    if (!recipientUsername) {
      return NextResponse.json({ error: 'recipientUsername is required' }, { status: 400 })
    }

    const recipient = await prisma.user.findFirst({ where: { user_name: recipientUsername } })
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
    }

    const existing = await prisma.conversation.findFirst({
      where: {
        participants: {
          hasEvery: [session.id, recipient.id]
        }
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (existing) {
      const otherUser = {
        id: recipient.id,
        name: recipient.name,
        user_name: recipient.user_name,
        user_photo: recipient.user_photo,
        role: recipient.role
      }

      const lastMessage = existing.messages[0]?.content || null
      const lastMessageAt = existing.messages[0]?.createdAt || existing.updatedAt

      return NextResponse.json({
        success: true,
        conversation: {
          id: existing.id,
          otherUser,
          lastMessage,
          lastMessageAt,
          unreadCount: 0
        }
      })
    }

    // Create a new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: [session.id, recipient.id]
      }
    })

    const otherUser = {
      id: recipient.id,
      name: recipient.name,
      user_name: recipient.user_name,
      user_photo: recipient.user_photo,
      role: recipient.role
    }

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        otherUser,
        lastMessage: null,
        lastMessageAt: conversation.createdAt,
        unreadCount: 0
      }
    })
  } catch (error) {
    console.error('Start conversation API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}