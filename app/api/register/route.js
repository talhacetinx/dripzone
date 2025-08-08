import { NextResponse } from "next/server";
import { checkRateLimit, ALLOWED_ORIGINS } from "../lib/rate";
import { sanitizeInput } from "../lib/sanitize";
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma'
import path from "path";
import fs from "fs/promises";
import { randomBytes } from "crypto";

const allowedTypes = ["png", "jpeg", "jpg", "webp"];

async function saveUploadedImage(file, folder = "profile-photos") {
  if (!file) return null;
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Dosya uzantısını kontrol et
  const extension = file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(extension)) {
    throw new Error("Desteklenmeyen dosya türü");
  }
  
  // Dosya boyutunu kontrol et (5MB)
  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error("Dosya çok büyük (Max 5MB)");
  }
  
  const uniqueName = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", folder);
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, uniqueName);
  await fs.writeFile(filePath, buffer);
  
  return `/${folder}/${uniqueName}`;
}

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.' },
        { status: 429 }
      );
    }

    const origin = req.headers.get("origin") || "";
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ message: "Yetkisiz istek." }, { status: 403 });
    }

    // FormData'yı parse et
    const formData = await req.formData();
    
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const user_type = formData.get('user_type');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const user_name = formData.get('user_name');
    const agreeTerms = formData.get('agreeTerms') === 'true';
    const country = formData.get('country');
    const user_photo = formData.get('user_photo'); // File object

    if (!agreeTerms) {
      return NextResponse.json({ message: "Kullanıcı onay metnini onaylayın" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Yanlış E-mail Formatı" }, { status: 400 });
    }

    if (password !== confirmPassword || password.length < 6) {
      return NextResponse.json(
        { message: "Şifreler uyuşmalı ve en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Bu kullanıcı zaten kayıtlı" }, { status: 400 });
    }

    if (user_type !== "ARTIST" && user_type !== "PROVIDER") {
      return NextResponse.json({ message: "Geçersiz kullanıcı tipi" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Fotoğrafı kaydet
    let user_photo_url = null;
    if (user_photo && user_photo.size > 0) {
      try {
        user_photo_url = await saveUploadedImage(user_photo, "profile-photos");
      } catch (photoError) {
        return NextResponse.json({ message: "Fotoğraf yükleme hatası: " + photoError.message }, { status: 400 });
      }
    }

    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        user_name: user_name,
        email,
        phone,
        password: hashedPassword,
        role: user_type,
        country: country,
        user_photo: user_photo_url, // Fotoğraf URL'sini kaydet
      },
    });

    return NextResponse.json({ success: true ,message: "Kayıt başarılı." }, { status: 200 });

  } catch (error) {
    console.error("REGISTER API ERROR:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}