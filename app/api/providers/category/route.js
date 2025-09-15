import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  __internal: {
    engine: {
      binaryTargets: ["native"],
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : 0;

    if (!serviceType) {
      return NextResponse.json({
        success: false,
        error: 'Service type is required'
      }, { status: 400 });
    }

    const providers = await prisma.providerProfile.findMany({
      where: {
        serviceType: serviceType,
        user: {
          isApproved: true
        }
      },
      select: {
        id: true,
        serviceType: true,
        provider_title: true,
        about: true,
        avatarUrl: true,
        backgroundUrl: true,
        experience: true,
        projectCount: true,
        responseTime: true,
        specialties: true,
        packages: {
          select: true
        },
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            user_name: true,
            user_photo: true,
            country: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: limit,
      skip: offset
    });

    const processedProviders = providers.map(provider => ({
      ...provider,
      about: provider.about ? provider.about.substring(0, 200) : null,
      specialties: provider.specialties ? provider.specialties.slice(0, 5) : []
    }));

    // Optimize edilmiş cache headers
    return NextResponse.json({
      success: true,
      providers: processedProviders,
      pagination: {
        limit,
        offset,
        hasMore: processedProviders.length === limit,
        total: processedProviders.length
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300, max-age=30',
        'CDN-Cache-Control': 'public, s-maxage=60',
        'Vary': 'Accept-Encoding'
      }
    });

  } catch (error) {
    console.error('Provider fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
