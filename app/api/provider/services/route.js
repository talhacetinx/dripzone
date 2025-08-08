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

    const services = await prisma.service.findMany({
      where: {
        providerId: auth.user.id
      },
      include: {
        images: true
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Services fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}