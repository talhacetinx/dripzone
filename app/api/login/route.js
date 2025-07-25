import { NextResponse } from "next/server";
import prisma from "../lib/prisma"; 
import bcrypt from "bcryptjs";
import { signToken } from "../lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email ve şifre zorunlu" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Geçersiz email veya şifre" }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Geçersiz email veya şifre" }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image || null,
    });

    const res = NextResponse.json({ message: "Giriş başarılı" });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure:false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });

    return res;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}