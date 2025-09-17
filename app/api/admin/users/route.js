import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";

export async function GET(req) {
    try {
        console.log("🔍 Admin users API çağrıldı");
        
        const token = req.cookies.get("token")?.value;
        console.log("🎫 Token bulundu:", !!token);
        
        if (!token) {
            return NextResponse.json({ error: "Token bulunamadı" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        } catch (error) {
            return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });
        }

        if (decoded.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin yetkisi gerekli" }, { status: 403 });
        }

        try {
            
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    user_name: true,
                    role: true,
                    user_photo: true,
                    userPending: true,
                    createdAt: true,
                    phone: true,
                    isApproved: true,
                    country: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            });


            return NextResponse.json({ 
                success: true,
                users: users,
                total: users.length
            });
        } catch (prismaError) {
            

            return NextResponse.json({ 
                success: true,
                users: mockUsers,
                total: mockUsers.length,
                note: "Database bağlantı hatası - mock data kullanılıyor",
                error: prismaError.message
            });
        }

    } catch (error) {
        console.error("❌ Admin users fetch error:", error);
        return NextResponse.json({ 
            error: "Sunucu hatası", 
            details: error.message 
        }, { status: 500 });
    }
}
