import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getAuthUser } from "../../../lib/auth";
import { checkRateLimit, ALLOWED_ORIGINS } from "../../../lib/rate";

export async function GET(req) {
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

  // URL'den provider_id parametresini al
  const { searchParams } = new URL(req.url);
  const providerId = searchParams.get('provider_id');

  const session = await getAuthUser();
  
  // providerId verilmişse, o provider'ın paketlerini getir (sadece public olanları)
  if (providerId) {
    try {
      const providerProfile = await prisma.providerProfile.findFirst({
        where: { userId: providerId },
        select: { packages: true }
      });

      if (!providerProfile) {
        return NextResponse.json({ packages: [] }, { status: 200 });
      }

      // Sadece public paketleri filtrele
      const publicPackages = (providerProfile.packages || []).filter(pkg => pkg.isPublic);
      return NextResponse.json({ packages: publicPackages }, { status: 200 });
    } catch (err) {
      console.error("Paket getirme hatası:", err);
      return NextResponse.json({ error: err.message || "Sunucu hatası" }, { status: 500 });
    }
  }

  // providerId yoksa, oturum kontrolü yap
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

    if (!user || user.role !== "PROVIDER") {
      return NextResponse.json({ error: "Sadece hizmet sağlayıcıları paketlerini görebilir" }, { status: 403 });
    }

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
      select: { packages: true }
    });

    if (!providerProfile) {
      return NextResponse.json({ 
        packages: []
      }, { status: 200 });
    }

    return NextResponse.json({ 
      packages: providerProfile.packages || []
    }, { status: 200 });

  } catch (err) {
    console.error("Paket getirme hatası:", err);
    return NextResponse.json({ 
      error: err.message || "Sunucu hatası" 
    }, { status: 500 });
  }
}
