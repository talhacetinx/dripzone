import { NextResponse } from "next/server";
import { getAuthUser } from "../../lib/auth";
import prisma from "../../lib/prisma";

// Basit in-memory cache
const profileCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

export async function GET() {
  const startTime = Date.now();
  
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json(
        { error: "Oturum verisi eksik, lütfen giriş yapınız." },
        { status: 401 }
      );
    }

    const { id: userId, role } = session;
    const cacheKey = `${userId}-${role}`;

    const cached = profileCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`✅ Cache hit for user ${userId} - ${Date.now() - startTime}ms`);
      return NextResponse.json({
        ...cached.data,
        _cached: true,
        _responseTime: Date.now() - startTime
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        user_photo: true,
        artistProfile: role === "ARTIST" ? {
          select: {
            bio: true,
            backgroundUrl: true,
            experience: true,
            experiences: true,
            genres: true,
            title: true,
            otherData: true,
          }
        } : false,
        providerProfile: role === "PROVIDER" ? {
          select: {
            studioName: true,
            about: true,
            serviceType: true,
            serviceData: true, 
            otherData: true,
            backgroundUrl: true,
            experience: true,
            projectCount: true,
            responseTime: true,
            specialties: true,
            importantClients: true,
            genres: true,
          }
        } : false
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (role === "ARTIST") {
      const p = user.artistProfile;
      const responseData = {
        profile: p ? {
          bio: p.bio,
          avatarUrl: user.user_photo,
          backgroundUrl: p.backgroundUrl,
          experience: p.experience,
          experiences: p.experiences,
          genres: p.genres ? (Array.isArray(p.genres) ? p.genres : p.genres.split(",")) : [],
          title: p.title,
          // otherData'dan platform linklerini çıkar
          youtubeLink: p.otherData?.platformLinks?.youtube || '',
          spotifyLink: p.otherData?.platformLinks?.spotify || '',
        } : null
      };
      
      // Cache'e kaydet
      profileCache.set(cacheKey, {
        data: responseData,
        timestamp: Date.now()
      });
      
      console.log(`✅ Artist profile loaded - ${Date.now() - startTime}ms`);
      return NextResponse.json({
        ...responseData,
        _cached: false,
        _responseTime: Date.now() - startTime
      });
    }

    if (role === "PROVIDER") {
      const p = user.providerProfile;
      
      const responseData = {
        profile: p ? {
          studioName: p.studioName,
          about: p.about,
          serviceType: p.serviceType, // Bu önemli - client tarafında kullanılacak
          serviceData: p.serviceData, // Service data'yı da include et
          avatarUrl: user.user_photo,
          backgroundUrl: p.backgroundUrl,
          experience: p.experience,
          projectCount: p.projectCount,
          responseTime: p.responseTime,
          specialties: p.specialties ? (Array.isArray(p.specialties) ? p.specialties : p.specialties.split(",")) : [],
          importantClients: p.importantClients ? (Array.isArray(p.importantClients) ? p.importantClients : p.importantClients.split(",")) : [],
          genres: p.genres ? (Array.isArray(p.genres) ? p.genres : p.genres.split(",")) : [],
          // otherData'dan platform linklerini çıkar
          youtubeLink: p.otherData?.platformLinks?.youtube || '',
          spotifyLink: p.otherData?.platformLinks?.spotify || '',
        } : null
      };
      
      // Cache'e kaydet
      profileCache.set(cacheKey, {
        data: responseData,
        timestamp: Date.now()
      });
      
      return NextResponse.json({
        ...responseData,
        _cached: false,
        _responseTime: Date.now() - startTime
      });
    }

    return NextResponse.json({ profile: null });

  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
