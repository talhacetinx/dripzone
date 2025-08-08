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

    const orders = await prisma.order.findMany({
      where: {
        providerId: auth.user.id
      },
      include: {
        service: {
          select: {
            title: true
          }
        },
        artist: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}