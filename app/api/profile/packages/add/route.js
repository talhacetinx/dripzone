import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getAuthUser } from "../../../lib/auth";
import { checkRateLimit, ALLOWED_ORIGINS } from "../../../lib/rate";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: "Çok fazla istek gönderdiniz. Lütfen bekleyin." },
      { status: 429 }
    );
  }

  const origin = req.headers.get("origin") || "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ message: "Yetkisiz istek." }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
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

    if (!user || user.role !== "PROVIDER") {
      return NextResponse.json({ error: "Sadece hizmet sağlayıcıları paket oluşturabilir" }, { status: 403 });
    }

    const { packages } = body;

    if (!Array.isArray(packages)) {
      return NextResponse.json({ error: "Paketler array formatında olmalıdır" }, { status: 400 });
    }

    for (const pkg of packages) {
      if (!pkg.title || !pkg.description || !pkg.features || !pkg.deliveryTime || !pkg.price) {
        return NextResponse.json({ 
          error: "Her paket için başlık, açıklama, özellikler, teslim süresi ve fiyat gereklidir" 
        }, { status: 400 });
      }

      if (!Array.isArray(pkg.features) || pkg.features.length === 0) {
        return NextResponse.json({ 
          error: "Paket özellikler en az bir özellik içermelidir" 
        }, { status: 400 });
      }

      if (typeof pkg.price !== 'number' || pkg.price <= 0) {
        return NextResponse.json({ 
          error: "Paket fiyatı pozitif bir sayı olmalıdır" 
        }, { status: 400 });
      }

      if (typeof pkg.isPublic !== 'boolean') {
        pkg.isPublic = false;
      }
    }

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId }
    });

    if (!providerProfile) {
      return NextResponse.json({ 
        error: "Profil bulunamadı. Önce profilinizi oluşturun." 
      }, { status: 404 });
    }

    const result = await prisma.providerProfile.update({
      where: { userId },
      data: {
        packages: packages
      }
    });

    return NextResponse.json({ 
      message: "Paketler başarıyla güncellendi!",
      packages: result.packages
    }, { status: 200 });

  } catch (err) {
    console.error("Paket güncelleme hatası:", err);
    return NextResponse.json({ 
      error: err.message || "Sunucu hatası" 
    }, { status: 500 });
  }
}
