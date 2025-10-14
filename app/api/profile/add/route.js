import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { randomBytes } from "crypto";
import prisma from "../../lib/prisma";
import { getAuthUser } from "../../lib/auth";
import { checkRateLimit, ALLOWED_ORIGINS } from "../../lib/rate";
import { saveFile } from "../../../../lib/fileUpload";

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
  console.log("🔍 Request origin:", origin);
  console.log("🔍 Allowed origins:", ALLOWED_ORIGINS);
  
  if (process.env.NODE_ENV === 'production' && !ALLOWED_ORIGINS.includes(origin)) {
    console.log("❌ Origin not allowed:", origin);
    return NextResponse.json({ 
      message: "Yetkisiz istek.", 
      origin,
      allowedOrigins: ALLOWED_ORIGINS 
    }, { status: 403 });
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
        experiences = [],
        genres = [],
        profile_title,
        background_image,
        youtubeLink,
        spotifyLink,
      } = body;

      if (!photos) return NextResponse.json({ error: "Fotoğraf eksik" }, { status: 400 });

      let avatarUrl;
      try {
        if (typeof photos === 'string' && photos.startsWith('/')) {
          avatarUrl = photos;
        } else {
          try {
            avatarUrl = await saveBase64Image(photos, "profile-page");
          } catch (saveError) {
            console.warn("Dosya kaydetme başarısız, base64 olarak kaydediliyor:", saveError.message);
            avatarUrl = photos;
          }
        }
      } catch (imgError) {
        console.error("Artist avatar kaydetme hatası:", imgError);
        return NextResponse.json({ error: "Avatar kaydetme hatası: " + imgError.message }, { status: 500 });
      }
      
      let backgroundUrl = null;
      if (background_image) {
        try {
          if (typeof background_image === 'string' && background_image.startsWith('/')) {
            backgroundUrl = background_image;
          } else {
            try {
              backgroundUrl = await saveBase64Image(background_image, "profile-backgrounds");
            } catch (saveError) {
              console.warn("Background dosya kaydetme başarısız, base64 olarak kaydediliyor:", saveError.message);
              backgroundUrl = background_image;
            }
          }
        } catch (bgError) {
          console.error("Arkaplan fotoğrafı kaydetme hatası:", bgError);
        }
      }

      const existingProfile = await prisma.artistProfile.findUnique({
        where: { userId }
      });

      if (avatarUrl) {
        await prisma.user.update({
          where: { id: userId },
          data: { user_photo: avatarUrl }
        });
      }

      const otherDataJson = {
        platformLinks: {
          youtube: youtubeLink || '',
          spotify: spotifyLink || ''
        }
      };

      await prisma.artistProfile.upsert({
        where: { userId },
        update: {
          bio: profile_description,
          avatarUrl,
          backgroundUrl,
          experience: parseInt(profile_experience),
          experiences: Array.isArray(experiences) ? experiences : [],
          genres: Array.isArray(genres) ? genres.join(",") : String(genres || ""),
          title: profile_title,
          otherData: otherDataJson,
          slug: `/profile/${session.user_name}`,
        },
        create: {
          userId,
          bio: profile_description,
          avatarUrl,
          backgroundUrl,
          experience: parseInt(profile_experience),
          experiences: Array.isArray(experiences) ? experiences : [],
          genres: Array.isArray(genres) ? genres.join(",") : String(genres || ""),
          title: profile_title,
          otherData: otherDataJson,
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
        photos,
        provider_about,
        provider_experience,
        provider_project_count,
        provider_response_time,
        provider_studio_name,
        provider_specialties = [],
        provider_important_clients = [],
        provider_service_type,
        provider_portfolio_files = [],
        genres = [],
        background_image,
        youtubeLink,
        spotifyLink,
        // Yeni hizmet tipi verileri
        studioPhotos = [],
        musicProjects = [],
        albumCovers = [],
        musicVideos = [],
      } = body;

      if (!photos) {
        return NextResponse.json({ error: "Fotoğraf eksik" }, { status: 400 });
      }

      if (!provider_service_type) {
        return NextResponse.json({ error: "Hizmet tipi seçilmemiş" }, { status: 400 });
      }

      const serviceTypeMap = {
        'producer': 'music_producer',
        'album_cover_designer': 'album_cover_artist', 
        'music_video_director': 'music_video_director',
        'recording_studio': 'recording_studio',
        'music_producer': 'music_producer',
        'album_cover_artist': 'album_cover_artist'
      };

      const mappedServiceType = serviceTypeMap[provider_service_type] || provider_service_type;
      console.log(`🔄 Service type mapping: ${provider_service_type} → ${mappedServiceType}`);

      let avatarUrl;
      try {
        if (typeof photos === 'string' && photos.startsWith('/')) {
          avatarUrl = photos;
        } else {
          try {
            avatarUrl = await saveBase64Image(photos, "profile-page");
          } catch (saveError) {
            console.warn("Dosya kaydetme başarısız, base64 olarak kaydediliyor:", saveError.message);
            avatarUrl = photos;
          }
        }
      } catch (imgError) {
        console.error("Avatar kaydetme hatası:", imgError);
        return NextResponse.json({ error: "Avatar kaydetme hatası: " + imgError.message }, { status: 500 });
      }

      let backgroundUrl = null;
      if (background_image) {
        try {
          if (typeof background_image === 'string' && background_image.startsWith('/')) {
            backgroundUrl = background_image;
          } else {
            try {
              backgroundUrl = await saveBase64Image(background_image, "profile-backgrounds");
            } catch (saveError) {
              console.warn("Provider background dosya kaydetme başarısız, base64 olarak kaydediliyor:", saveError.message);
              backgroundUrl = background_image;
            }
          }
        } catch (bgError) {
          console.error("Arkaplan fotoğrafı kaydetme hatası:", bgError);
        }
      }

      // Hizmet tipine özel dosyaları işle
      let processedServiceData = {};
      
      try {
        console.log("� Hizmet tipi verileri işleniyor:", provider_service_type);
        
        if (mappedServiceType === "recording_studio") {
          // Stüdyo fotoğraflarını kaydet
          console.log("🏗️ Processing studio photos:");
          console.log("- studioPhotos received:", studioPhotos);
          console.log("- studioPhotos type:", typeof studioPhotos);
          console.log("- studioPhotos length:", studioPhotos?.length);
          if (studioPhotos && studioPhotos.length > 0) {
            console.log("- first photo structure:", studioPhotos[0]);
          }
          
          const processedPhotos = [];
          if (studioPhotos && Array.isArray(studioPhotos)) {
            for (let i = 0; i < studioPhotos.length; i++) {
              const photo = studioPhotos[i];
              console.log(`- Photo ${i + 1}:`, {
                hasFile: !!photo?.file,
                hasPreview: !!photo?.preview,
                hasUrl: !!photo?.url,
                isNew: photo?.isNew,
                name: photo?.name
              });
              
              // Hem yeni yüklenen hem de mevcut fotoğrafları işle
              if ((photo?.file && photo?.preview) || (!photo?.isNew && photo?.url)) {
                try {
                  let photoUrl, photoName;
                  
                  if (photo?.file && photo?.preview) {
                    // Yeni yüklenen fotoğraf
                    const saveResult = await saveFile(photo.preview, 'image', `studio/${userId}`);
                    if (saveResult.success) {
                      photoUrl = saveResult.filePath;
                      photoName = photo.name;
                    }
                  } else if (!photo?.isNew && photo?.url) {
                    // Mevcut fotoğraf (zaten kaydedilmiş)
                    photoUrl = photo.url;
                    photoName = photo.name;
                  }
                  
                  if (photoUrl) {
                    processedPhotos.push({
                      url: photoUrl,
                      name: photoName
                    });
                    console.log(`✅ Photo ${i + 1} processed successfully:`, photoUrl);
                  }
                } catch (err) {
                  console.error(`❌ Stüdyo fotoğrafı ${i + 1} kaydetme hatası:`, err);
                }
              } else {
                console.log(`⚠️ Photo ${i + 1} skipped - doesn't meet conditions`);
              }
            }
          }
          console.log("🏁 Final processed photos:", processedPhotos);
          processedServiceData.studioPhotos = processedPhotos;
          
        } else if (mappedServiceType === "music_producer") {
          // Müzik projelerini işle
          const processedProjects = [];
          if (musicProjects && Array.isArray(musicProjects)) {
            for (let i = 0; i < musicProjects.length; i++) {
              const project = musicProjects[i];
              const processedProject = {
                songName: project.songName || "",
                songDescription: project.songDescription || "",
                link: project.link || "",
                mediaUrl: null
              };
              
              if (project.mediaFile && project.mediaPreview) {
                try {
                  console.log(`Processing media for project ${i + 1}:`, {
                    mediaFileType: project.mediaFile?.type,
                    hasMediaPreview: !!project.mediaPreview,
                    songName: project.songName
                  });
                  
                  const mediaType = project.mediaFile.type.startsWith('image/') ? 'image' : 'video';
                  const saveResult = await saveFile(project.mediaPreview, mediaType, `producer/${userId}`);
                  console.log(`Save result for project ${i + 1}:`, saveResult);
                  
                  if (saveResult.success) {
                    processedProject.mediaUrl = saveResult.filePath;
                    console.log(`Set mediaUrl for project ${i + 1}:`, processedProject.mediaUrl);
                  }
                } catch (err) {
                  console.error(`Proje ${i + 1} medya kaydetme hatası:`, err);
                }
              } else {
                console.log(`No media file for project ${i + 1}:`, {
                  hasMediaFile: !!project.mediaFile,
                  hasMediaPreview: !!project.mediaPreview
                });
              }
              
              processedProjects.push(processedProject);
            }
          }
          processedServiceData.musicProjects = processedProjects;
          console.log('Final processedServiceData.musicProjects:', JSON.stringify(processedProjects, null, 2));
          
        } else if (mappedServiceType === "album_cover_artist") {
          // Albüm kapaklarını işle
          const processedCovers = [];
          if (albumCovers && Array.isArray(albumCovers)) {
            for (let i = 0; i < albumCovers.length; i++) {
              const cover = albumCovers[i];
              if (cover?.file && cover?.preview) {
                try {
                  const saveResult = await saveFile(cover.preview, 'image', `covers/${userId}`);
                  if (saveResult.success) {
                    processedCovers.push({
                      url: saveResult.filePath,
                      name: cover.name,
                      songLink: cover.songLink || ""
                    });
                  }
                } catch (err) {
                  console.error(`Albüm kapağı ${i + 1} kaydetme hatası:`, err);
                }
              }
            }
          }
          processedServiceData.albumCovers = processedCovers;
          
        } else if (mappedServiceType === "music_video_director") {
          // YouTube linklerini işle
          const processedVideos = [];
          if (musicVideos && Array.isArray(musicVideos)) {
            musicVideos.forEach((video) => {
              if (video.youtubeLink) {
                processedVideos.push({
                  youtubeLink: video.youtubeLink
                });
              }
            });
          }
          processedServiceData.musicVideos = processedVideos;
        }
        
        console.log(`✅ ${mappedServiceType} verileri başarıyla işlendi`);
      } catch (serviceError) {
        console.error("Hizmet tipi verileri işleme hatası:", serviceError);
        return NextResponse.json({ 
          error: "Hizmet tipi verileri işleme hatası: " + serviceError.message 
        }, { status: 500 });
      }

      try {
        const existingProfile = await prisma.providerProfile.findUnique({
          where: { userId }
        });

        // User tablosundaki user_photo'yu güncelle
        if (avatarUrl) {
          await prisma.user.update({
            where: { id: userId },
            data: { user_photo: avatarUrl }
          });
        }

        // Platform linklerini otherData alanında JSON olarak kaydet
        const providerOtherDataJson = {
          platformLinks: {
            youtube: youtubeLink || '',
            spotify: spotifyLink || ''
          }
        };

        const result = await prisma.providerProfile.upsert({
          where: { userId },
          update: {
            studioName: provider_studio_name || null,
            about: provider_about || null,
            serviceType: mappedServiceType,
            serviceData: processedServiceData, // Yeni hizmet tipi verileri
            otherData: providerOtherDataJson,
            avatarUrl,
            backgroundUrl,
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
            about: provider_about || null,
            serviceType: mappedServiceType,
            serviceData: processedServiceData, // Yeni hizmet tipi verileri
            otherData: providerOtherDataJson,
            avatarUrl,
            backgroundUrl,
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
