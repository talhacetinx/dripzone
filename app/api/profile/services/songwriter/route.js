import { NextResponse } from "next/server";
import { getAuthUser } from "../../../../api/lib/auth";
import prisma from "../../../../api/lib/prisma";

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

    // Songwriter serviceData'sını çek
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
      select: {
        serviceData: true,
        serviceType: true,
      }
    });

    if (!providerProfile || providerProfile.serviceType !== 'songwriter') {
      return NextResponse.json({
        error: "Songwriter profili bulunamadı"
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
      serviceType: 'songwriter',
      serviceData: serviceData || {} // Direkt serviceData'yı döndür
    });

  } catch (error) {
    console.error("Songwriter service data error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
