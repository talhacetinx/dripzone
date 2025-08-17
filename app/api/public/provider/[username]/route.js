import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { checkRateLimit, ALLOWED_ORIGINS } from "../../../../lib/rate";

export async function GET(req, { params }) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: "Çok fazla istek gönderdiniz. Lütfen bekleyin." },
      { status: 429 }
    );
  }

  const origin = req.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ message: "Yetkisiz istek." }, { status: 403 });
  }

  try {
    const { username } = params;

    if (!username) {
      return NextResponse.json({ error: "Kullanıcı adı gerekli" }, { status: 400 });
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { user_name: username },
      select: { 
        id: true, 
        role: true, 
        user_name: true,
        first_name: true,
        last_name: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (user.role !== "PROVIDER") {
      return NextResponse.json({ error: "Bu kullanıcı bir hizmet sağlayıcı değil" }, { status: 404 });
    }

    // Provider profilini bul
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
      select: {
        studioName: true,
        about: true,
        avatarUrl: true,
        backgroundUrl: true,
        experience: true,
        projectCount: true,
        responseTime: true,
        specialties: true,
        services: true,
        packages: true,
        importantClients: true,
        genres: true,
        studioPhotos: true,
        slug: true,
      }
    });

    if (!providerProfile) {
      return NextResponse.json({ error: "Provider profili bulunamadı" }, { status: 404 });
    }

    // Response data
    const profileData = {
      user: {
        username: user.user_name,
        firstName: user.first_name,
        lastName: user.last_name,
        fullName: `${user.first_name} ${user.last_name}`,
      },
      profile: {
        studioName: providerProfile.studioName,
        about: providerProfile.about,
        avatarUrl: providerProfile.avatarUrl,
        backgroundUrl: providerProfile.backgroundUrl,
        experience: providerProfile.experience,
        projectCount: providerProfile.projectCount,
        responseTime: providerProfile.responseTime,
        specialties: providerProfile.specialties || [],
        services: providerProfile.services || [],
        packages: providerProfile.packages || [],
        importantClients: providerProfile.importantClients || [],
        genres: providerProfile.genres || [],
        studioPhotos: providerProfile.studioPhotos || [],
        slug: providerProfile.slug,
      }
    };

    return NextResponse.json({ data: profileData }, { status: 200 });

  } catch (err) {
    console.error("Provider profil getirme hatası:", err);
    return NextResponse.json({ 
      error: err.message || "Sunucu hatası" 
    }, { status: 500 });
  }
}
