import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { checkRateLimit } from "@/lib/rate";
import { sanitizeInput } from "@/lib/sanitize";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.' },
        { status: 429 }
      );
    }

    const body = sanitizeInput(await req.json());

    const { password, confirmPassword, email, phone, user_type, firstName, lastName, agreeTerms } = body;

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

    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        password: hashedPassword,
        role: user_type,
      },
    });

    return NextResponse.json({ message: "Kayıt başarılı." }, { status: 200 });

  } catch (error) {
    console.error("REGISTER API ERROR:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}