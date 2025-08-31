import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Kullanıcının paketlerini getir
export async function GET(request, { params }) {
  try {
    const { userId } = params;

    // Kullanıcının var olduğunu kontrol et
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' }, 
        { status: 404 }
      );
    }

    // Sadece PROVIDER'lar paket paylaşabilir
    if (user.role !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'Bu özellik sadece hizmet sağlayıcılar için kullanılabilir' }, 
        { status: 403 }
      );
    }

    // ProviderProfile'dan gerçek paketleri getir
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: userId },
      select: {
        packages: true
      }
    });

    if (!providerProfile) {
      return NextResponse.json(
        { error: 'Provider profili bulunamadı' }, 
        { status: 404 }
      );
    }

    // JSON array'i parse et
    const packages = Array.isArray(providerProfile.packages) 
      ? providerProfile.packages 
      : [];

    return NextResponse.json({
      success: true,
      packages: packages
    });

  } catch (error) {
    console.error('Paket getirme hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' }, 
      { status: 500 }
    );
  }
}
