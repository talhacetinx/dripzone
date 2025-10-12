import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const body = await req.json()
    const { senderId, receiverId, content } = body

    const conversation = await prisma.conversation.upsert({
      where: {
        participants: {
          hasEvery: [senderId, receiverId]
        }
      },
      update: {},
      create: {
        participants: [senderId, receiverId],
      },
    })

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        conversationId: conversation.id,
      },
    })

    if (global.io) {
      global.io.emit('new_message', message)
    }

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}