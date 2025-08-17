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

        console.log("✅ Admin yetkisi doğrulandı, kullanıcılar getiriliyor...");

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
            
            const mockUsers = [
                {
                    id: 'cmeexeos00000t460ogfp95q5',
                    name: 'Mert Öztürk',
                    email: 'mertadminmert@gmail.com',
                    user_name: 'admin_merd',
                    role: 'ADMIN',
                    user_photo: null,
                    userPending: true, 
                    createdAt: new Date('2024-01-01'),
                    phone: '+90 555 111 2233',
                    country: 'Turkey'
                },
                {
                    id: 'user_example_1',
                    name: 'Ahmet Yılmaz',
                    email: 'ahmet@example.com',
                    user_name: 'ahmet_yz',
                    role: 'PROVIDER',
                    user_photo: 'https://randomuser.me/api/portraits/men/32.jpg',
                    userPending: false,
                    createdAt: new Date('2024-01-15'),
                    phone: '+90 555 123 4567',
                    country: 'Turkey'
                },
                {
                    id: 'user_example_2',
                    name: 'Elif Kaya',
                    email: 'elif@example.com',
                    user_name: 'elif_kaya',
                    role: 'ARTIST',
                    user_photo: 'https://randomuser.me/api/portraits/women/45.jpg',
                    userPending: false,
                    createdAt: new Date('2024-01-20'),
                    phone: '+90 555 987 6543',
                    country: 'Turkey'
                },
                {
                    id: 'user_example_3',
                    name: 'Can Demir',
                    email: 'can@example.com',
                    user_name: 'can_demir',
                    role: 'USER',
                    user_photo: null,
                    userPending: true, // Onaylı
                    createdAt: new Date('2024-01-25'),
                    phone: '+90 555 456 7890',
                    country: 'Turkey'
                }
            ];

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
