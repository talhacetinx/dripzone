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

    // Recording Studio serviceData'sını çek
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
      select: {
        serviceData: true,
        serviceType: true,
      }
    });

    if (!providerProfile || providerProfile.serviceType !== 'recording_studio') {
      return NextResponse.json({
        error: "Recording Studio profili bulunamadı"
      }, { status: 404 });
    }

    // serviceData JSON'ını parse et
    let serviceData = {};
    if (providerProfile.serviceData) {
      try {
        serviceData = typeof providerProfile.serviceData === 'string' 
          ? JSON.parse(providerProfile.serviceData)
          : providerProfile.serviceData;
        
        // Debug için log ekle
        console.log("Recording Studio serviceData:", serviceData);
        console.log("studioPhotos:", serviceData.recording_studio?.studioPhotos);
      } catch (e) {
        console.error("ServiceData parse error:", e);
      }
    }

    return NextResponse.json({
      serviceType: 'recording_studio',
      serviceData: serviceData || {}, // Direkt serviceData'yı döndür, wrapper yok
      _debug: {
        rawServiceData: providerProfile.serviceData,
        parsedServiceData: serviceData,
        studioPhotos: serviceData?.studioPhotos
      }
    });

  } catch (error) {
    console.error("Recording Studio service data error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
