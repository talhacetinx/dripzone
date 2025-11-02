import { NextResponse } from "next/server";
import { checkRateLimit } from "../lib/rate";
import { sanitizeInput } from "../lib/sanitize";
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma'

// Türkçe karakterleri İngilizce karakterlere çevirme fonksiyonu
function convertTurkishToEnglish(text) {
  const turkishChars = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U',
  };
  
  return text
    .split('')
    .map(char => turkishChars[char] || char)
    .join('')
    .replace(/[^a-zA-Z0-9_\-\.]/g, '') // Sadece alfanumerik karakterler, tire, nokta ve alt çizgi
    .toLowerCase(); // Kullanıcı adını küçük harfe çevir
}

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  try {
    await checkRateLimit(ip, 'register');
  } catch (rateLimitError) {
    return NextResponse.json({ message: rateLimitError.message }, { status: 429 });
  }

  try {
    const data = await req.json();
    const { firstName, lastName, user_name, email, phone, password, confirmPassword, country, user_type, agreeTerms } = data;

    // Kullanıcı adını Türkçe karakterlerden temizle
    const convertedUsername = convertTurkishToEnglish(user_name);

    const sanitizedData = {
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      user_name: sanitizeInput(convertedUsername), 
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      country: sanitizeInput(country),
      user_type: sanitizeInput(user_type),
    };

    const { firstName: sFirstName, lastName: sLastName, user_name: sUserName, email: sEmail, phone: sPhone, country: sCountry, user_type: sUserType } = sanitizedData;

    if (!sFirstName || !sLastName || !sUserName || !sEmail || !sPhone || !password || !confirmPassword || !sUserType) {
      return NextResponse.json({ message: "Gerekli alanlar doldurulmalı" }, { status: 400 });
    }

    if (sUserName.length < 3) {
      return NextResponse.json({ message: "Kullanıcı adı en az 3 karakter olmalı" }, { status: 400 });
    }

    const existingUsername = await prisma.user.findUnique({ where: { user_name: sUserName } });
    if (existingUsername) {
      return NextResponse.json({ message: "Bu kullanıcı adı zaten alınmış" }, { status: 400 });
    }

    if (!agreeTerms) {
      return NextResponse.json({ message: "Kullanıcı onay metnini onaylayın" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sEmail)) {
      return NextResponse.json({ message: "Yanlış E-mail Formatı" }, { status: 400 });
    }

    if (password !== confirmPassword || password.length < 6) {
      return NextResponse.json(
        { message: "Şifreler uyuşmalı ve en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email: sEmail } });
    if (existingUser) {
      return NextResponse.json({ message: "Bu kullanıcı zaten kayıtlı" }, { status: 400 });
    }

    if (sUserType !== "ARTIST" && sUserType !== "PROVIDER") {
      return NextResponse.json({ message: "Geçersiz kullanıcı tipi" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: `${sFirstName} ${sLastName}`,
        user_name: sUserName,
        email: sEmail,
        phone: sPhone,
        password: hashedPassword,
        role: sUserType,
        country: sCountry || "Belirtilmemiş", 
      },
    });

    return NextResponse.json({ success: true, message: "Kayıt başarılı. Profil fotoğrafınızı dashboard'dan ekleyebilirsiniz." }, { status: 200 });

  } catch (error) {
    console.error("REGISTER API ERROR:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}