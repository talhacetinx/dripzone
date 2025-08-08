'use server'

import { NextResponse } from 'next/server'
import { getAuthUser } from '../../lib/auth'
import prisma from '../../lib/prisma'

export async function GET() {
  try {
    const auth = await getAuthUser()
    
    if (!auth || auth.role !== 'PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { providerId: auth.user.id },
          { artistId: auth.user.id }
        ]
      },
      include: {
        messages: {
          where: {
            read: false,
            NOT: {
              senderId: auth.user.id
            }
          }
        }
      }
    })

    // Her konuşma için okunmamış mesaj sayısını hesapla
    const conversationsWithUnreadCount = conversations.map(conv => ({
      id: conv.id,
      unread_count: conv.messages.length
    }))

    return NextResponse.json(conversationsWithUnreadCount)
  } catch (error) {
    console.error('Conversations fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}