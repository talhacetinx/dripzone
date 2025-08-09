import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { randomBytes } from "crypto";
import prisma from "../../lib/prisma";
import { getAuthUser } from "../../lib/auth";
import { checkRateLimit, ALLOWED_ORIGINS } from "../../lib/rate";

const allowedTypes = ["png", "jpeg", "jpg", "webp"];

async function saveBase64Image(dataUrl, folder = "profile-page") {
  const matches = dataUrl?.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) throw new Error("Geçersiz görsel formatı");
  const mimeType = matches[1];
  const base64Data = matches[2];
  const extension = mimeType.split("/")[1];

  if (!allowedTypes.includes(extension)) throw new Error("Desteklenmeyen dosya türü");
  const buffer = Buffer.from(base64Data, "base64");
  if (buffer.length > 5 * 1024 * 1024) throw new Error("Dosya çok büyük");

  const uniqueName = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", folder);
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, uniqueName);
  await fs.writeFile(filePath, buffer);
  return `/${folder}/${uniqueName}`;
}

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
      { status: 400 }
    );
  }

  const userId = session.id;
  const role = body.userInfo?.role;

  try {
    if (role === "ARTIST") {
      const {
        photos,
        userPhotoName,
        profile_description,
        profile_experience,
        experiences = [], // Uzmanlık alanları
        genres = [],
        profile_title,
        background_image, // Arkaplan fotoğrafı eklendi
      } = body;

      if (!photos) return NextResponse.json({ error: "Fotoğraf eksik" }, { status: 400 });

      const avatarUrl = await saveBase64Image(photos, "profile-page");
      
      // Arkaplan fotoğrafını kaydet
      let backgroundUrl = null;
      if (background_image) {
        try {
          // Eğer background_image zaten bir URL ise (güncelleme durumu), doğrudan kullan
          if (typeof background_image === 'string' && background_image.startsWith('/')) {
            backgroundUrl = background_image;
          } else {
            backgroundUrl = await saveBase64Image(background_image, "profile-backgrounds");
          }
        } catch (bgError) {
          console.error("Arkaplan fotoğrafı kaydetme hatası:", bgError);
          // Arkaplan fotoğrafı hatalı olursa devam et ama logla
        }
      }

      // Önce mevcut profil var mı kontrol edelim
      const existingProfile = await prisma.artistProfile.findUnique({
        where: { userId }
      });

      await prisma.artistProfile.upsert({
        where: { userId },
        update: {
          bio: profile_description,
          avatarUrl,
          backgroundUrl, // Arkaplan URL'i eklendi
          experience: parseInt(profile_experience),
          experiences: Array.isArray(experiences) ? experiences : [],
          genres: Array.isArray(genres) ? genres.join(",") : String(genres || ""),
          title: profile_title,
          slug: `/profile/${session.user_name}`,
        },
        create: {
          userId,
          bio: profile_description,
          avatarUrl,
          backgroundUrl, // Arkaplan URL'i eklendi
          experience: parseInt(profile_experience),
          experiences: Array.isArray(experiences) ? experiences : [],
          genres: Array.isArray(genres) ? genres.join(",") : String(genres || ""),
          title: profile_title,
          slug: `/profile/${session.user_name}`,
        },
      });

      const message = existingProfile 
        ? "Profil başarıyla güncellendi!" 
        : "Profil başarıyla oluşturuldu!";

      return NextResponse.json({ message }, { status: 200 });
    }

    if (role === "PROVIDER") {
      const {
        photos, // avatar
        provider_about,
        provider_experience,
        provider_project_count,
        provider_response_time,
        provider_studio_name,
        provider_services = [],
        provider_services_csv,
        provider_specialties = [],
        provider_important_clients = [],
        provider_studio_images = [], // [{dataUrl,name}]
        genres = [],
        background_image, // Arkaplan fotoğrafı eklendi
      } = body;

      if (!photos) {
        return NextResponse.json({ error: "Fotoğraf eksik" }, { status: 400 });
      }

      let avatarUrl;
      try {
        // Eğer photos zaten bir URL ise (güncelleme durumu), doğrudan kullan
        if (typeof photos === 'string' && photos.startsWith('/')) {
          avatarUrl = photos;
        } else {
          avatarUrl = await saveBase64Image(photos, "profile-page");
        }
      } catch (imgError) {
        console.error("Avatar kaydetme hatası:", imgError);
        return NextResponse.json({ error: "Avatar kaydetme hatası: " + imgError.message }, { status: 500 });
      }

      // Arkaplan fotoğrafını kaydet
      let backgroundUrl = null;
      if (background_image) {
        try {
          // Eğer background_image zaten bir URL ise (güncelleme durumu), doğrudan kullan
          if (typeof background_image === 'string' && background_image.startsWith('/')) {
            backgroundUrl = background_image;
          } else {
            backgroundUrl = await saveBase64Image(background_image, "profile-backgrounds");
          }
        } catch (bgError) {
          console.error("Arkaplan fotoğrafı kaydetme hatası:", bgError);
          // Arkaplan fotoğrafı hatalı olursa devam et ama logla
        }
      }

      const studioPhotos = [];
      try {
        for (const item of provider_studio_images.slice(0, 3)) {
          if (item?.dataUrl) {
            // Eğer dataUrl zaten bir URL ise (güncelleme durumu), doğrudan kullan
            if (typeof item.dataUrl === 'string' && item.dataUrl.startsWith('/')) {
              studioPhotos.push(item.dataUrl);
            } else {
              const url = await saveBase64Image(item.dataUrl, "studio");
              studioPhotos.push(url);
            }
          }
        }
      } catch (studioError) {
        console.error("Stüdyo fotoğrafları kaydetme hatası:", studioError);
        return NextResponse.json({ error: "Stüdyo fotoğrafları kaydetme hatası: " + studioError.message }, { status: 500 });
      }

      try {
        // Önce mevcut profil var mı kontrol edelim
        const existingProfile = await prisma.providerProfile.findUnique({
          where: { userId }
        });

        const result = await prisma.providerProfile.upsert({
          where: { userId },
          update: {
            studioName: provider_studio_name || null,
            studioPhoto: studioPhotos[0] || null,
            studioPhotos,
            about: provider_about || null,
            services: Array.isArray(provider_services) ? provider_services : [],
            avatarUrl,
            backgroundUrl, // Arkaplan URL'i eklendi
            experience: provider_experience ? parseInt(provider_experience) : null,
            projectCount: provider_project_count ? parseInt(provider_project_count) : null,
            responseTime: provider_response_time ? parseInt(provider_response_time) : null,
            specialties: Array.isArray(provider_specialties) ? provider_specialties : [],
            importantClients: Array.isArray(provider_important_clients)
              ? provider_important_clients
              : [],
            genres: Array.isArray(genres) ? genres : [],
            slug: `/provider/${session.user_name}`,
          },
          create: {
            userId,
            studioName: provider_studio_name || null,
            studioPhoto: studioPhotos[0] || null,
            studioPhotos,
            about: provider_about || null,
            services: Array.isArray(provider_services) ? provider_services : [],
            avatarUrl,
            backgroundUrl, // Arkaplan URL'i eklendi
            experience: provider_experience ? parseInt(provider_experience) : null,
            projectCount: provider_project_count ? parseInt(provider_project_count) : null,
            responseTime: provider_response_time ? parseInt(provider_response_time) : null,
            specialties: Array.isArray(provider_specialties) ? provider_specialties : [],
            importantClients: Array.isArray(provider_important_clients)
              ? provider_important_clients
              : [],
            genres: Array.isArray(genres) ? genres : [],
            slug: `/provider/${session.user_name}`,
          },
        });

        const message = existingProfile 
          ? "Profil başarıyla güncellendi!" 
          : "Profil başarıyla oluşturuldu!";

        return NextResponse.json({ message }, { status: 200 });
      } catch (dbError) {
        console.error("Veritabanı hatası:", dbError);
        return NextResponse.json({ error: "Veritabanı hatası: " + dbError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Desteklenmeyen rol" }, { status: 403 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Sunucu hatası" }, { status: 500 });
  }
}