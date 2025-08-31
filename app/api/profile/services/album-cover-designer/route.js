import { NextResponse } from "next/server";
import { getAuthUser } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: userId } = session;

    // Album Cover Designer serviceData'sını çek
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
      select: {
        serviceData: true,
        serviceType: true,
      }
    });

    if (!providerProfile || (providerProfile.serviceType !== 'album_cover_designer' && providerProfile.serviceType !== 'album_cover_artist')) {
      return NextResponse.json({
        error: "Album Cover Designer profili bulunamadı"
      }, { status: 404 });
    }

    // serviceData JSON'ını parse et
    let serviceData = {};
    if (providerProfile.serviceData) {
      try {
        serviceData = typeof providerProfile.serviceData === 'string' 
          ? JSON.parse(providerProfile.serviceData)
          : providerProfile.serviceData;
      } catch (e) {
        console.error("ServiceData parse error:", e);
      }
    }

    return NextResponse.json({
      serviceType: 'album_cover_designer',
      serviceData: serviceData || {} // Direkt serviceData'yı döndür
    });

  } catch (error) {
    console.error("Album Cover Designer service data error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
