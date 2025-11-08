import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "default_secret", { expiresIn: "7d" });
};

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password, accessKey } = body;
        const envAccessKey = process.env.ADMIN_ACCESS_KEY;
        
        if (accessKey !== envAccessKey) {
            return NextResponse.json({ error: "Erişim anahtarı hatalı." }, { status: 400 });
        }

        if (!email || !password) {
            return NextResponse.json({ error: "Email ve şifre zorunlu" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "Geçersiz email veya şifre" }, { status: 401 });
        }

        if (user.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin yetkisi gerekli" }, { status: 403 });
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
            user_name: user.user_name,
            isAdmin: true
        });


        const res = NextResponse.json({ 
            message: "Giriş başarılı",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, 
        });

        return res;
    } catch (err) {
        console.error("Admin login error:", err);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}