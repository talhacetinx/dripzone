import { NextResponse } from "next/server";
import prisma from "../lib/prisma"; 
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, authCode, password, confirmPassword } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta formatı" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Bu e-posta ile kayıtlı kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    if (user.newPasswordAuth !== authCode) {
      return NextResponse.json(
        { success: false, message: "Doğrulama kodu hatalı" },
        { status: 401 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Şifreler eşleşmiyor" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        newPasswordAuth: null, 
      },
    });

    return NextResponse.json(
      { success: true, message: "Şifre başarıyla güncellendi" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}