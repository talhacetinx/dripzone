import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Prisma client'ı doğrudan burada tanımla
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}

export async function POST(req, { params }) {
    try {
        console.log("🔍 Kullanıcı onaylama API çağrıldı, ID:", params.id);
        
        // Admin token kontrolü
        const token = req.cookies.get("token")?.value;
        console.log("🎫 Token bulundu:", !!token);
        
        if (!token) {
            console.log("❌ Token yok");
            return NextResponse.json({ error: "Token bulunamadı" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
            console.log("✅ Token decode edildi:", { id: decoded.id, role: decoded.role, isAdmin: decoded.isAdmin });
        } catch (error) {
            console.log("❌ Token decode hatası:", error);
            return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });
        }

        // Admin kontrolü - sadece role kontrolü yeterli
        if (decoded.role !== "ADMIN") {
            console.log("❌ Admin yetkisi yok:", { role: decoded.role });
            return NextResponse.json({ error: "Admin yetkisi gerekli" }, { status: 403 });
        }

        console.log("✅ Admin yetkisi doğrulandı, kullanıcı onaylanıyor...");

        // Kullanıcıyı onayla (userPending = false, isApproved = true yap)
        try {
            const updatedUser = await prisma.user.update({
                where: {
                    id: params.id
                },
                data: {
                    userPending: false,
                    isApproved: true
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    userPending: true,
                    isApproved: true
                }
            });

            console.log("✅ Kullanıcı onaylandı:", updatedUser);

            return NextResponse.json({ 
                success: true,
                message: "Kullanıcı başarıyla onaylandı",
                user: updatedUser
            });
        } catch (prismaError) {
            console.error("❌ Prisma onaylama hatası:", prismaError);
            return NextResponse.json({ 
                error: "Kullanıcı onaylanırken hata oluştu",
                details: prismaError.message 
            }, { status: 500 });
        }

    } catch (error) {
        console.error("❌ Kullanıcı onaylama hatası:", error);
        return NextResponse.json({ 
            error: "Sunucu hatası", 
            details: error.message 
        }, { status: 500 });
    }
}
