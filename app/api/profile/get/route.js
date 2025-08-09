import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { getAuthUser } from "../../lib/auth";
import { checkRateLimit, ALLOWED_ORIGINS } from "../../lib/rate";

export async function GET(req) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: "Çok fazla istek gönderdiniz. Lütfen bekleyin." },
      { status: 429 }
    );
  }

  const origin = req.headers.get("origin") || "";
  
  // Origin kontrolünü geçici olarak devre dışı bırak (sadece development için)
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ message: "Yetkisiz istek." }, { status: 403 });
  }

  const session = await getAuthUser();
  if (!session) {
    return NextResponse.json(
      { error: "Oturum verisi eksik, lütfen oturum açınız." },
      { status: 401 }
    );
  }

  const userId = session.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (user.role === "ARTIST") {
      const artistProfile = await prisma.artistProfile.findUnique({
        where: { userId }
      });

      if (!artistProfile) {
        return NextResponse.json({ profile: null }, { status: 200 });
      }

      return NextResponse.json({
        profile: {
          bio: artistProfile.bio,
          avatarUrl: artistProfile.avatarUrl,
          backgroundUrl: artistProfile.backgroundUrl,
          experience: artistProfile.experience,
          genres: artistProfile.genres ? artistProfile.genres.split(",") : [],
          title: artistProfile.title,
        }
      }, { status: 200 });
    }

    if (user.role === "PROVIDER") {
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId }
      });

      if (!providerProfile) {
        return NextResponse.json({ profile: null }, { status: 200 });
      }

      return NextResponse.json({
        profile: {
          studioName: providerProfile.studioName,
          studioPhoto: providerProfile.studioPhoto,
          studioPhotos: providerProfile.studioPhotos || [],
          about: providerProfile.about,
          services: providerProfile.services || [],
          avatarUrl: providerProfile.avatarUrl,
          backgroundUrl: providerProfile.backgroundUrl,
          experience: providerProfile.experience,
          projectCount: providerProfile.projectCount,
          responseTime: providerProfile.responseTime,
          specialties: providerProfile.specialties || [],
          importantClients: providerProfile.importantClients || [],
          genres: providerProfile.genres || [],
        }
      }, { status: 200 });
    }

    return NextResponse.json({ error: "Desteklenmeyen rol" }, { status: 403 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Sunucu hatası" }, { status: 500 });
  }
}
