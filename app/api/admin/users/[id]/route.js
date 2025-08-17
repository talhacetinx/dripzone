import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Prisma client'ı doğrudan burada tanımla
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}

export async function DELETE(req, { params }) {
    try {
        console.log("🔍 Kullanıcı silme API çağrıldı, ID:", params.id);
        
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

        // Kendi kendini silmeye izin verme
        if (decoded.id === params.id) {
            console.log("❌ Admin kendi kendini silmeye çalışıyor");
            return NextResponse.json({ error: "Kendi hesabınızı silemezsiniz" }, { status: 400 });
        }

        console.log("✅ Admin yetkisi doğrulandı, kullanıcı siliniyor...");

        // İlişkili verileri sil
        try {
            await prisma.$transaction(async (tx) => {
                // İlk önce ilişkili profilleri sil
                await tx.artistProfile.deleteMany({
                    where: { userId: params.id }
                });

                await tx.providerProfile.deleteMany({
                    where: { userId: params.id }
                });

                // Artist ve Provider kayıtlarını sil
                await tx.artist.deleteMany({
                    where: { userId: params.id }
                });

                await tx.provider.deleteMany({
                    where: { userId: params.id }
                });

                // Son olarak kullanıcıyı sil
                const deletedUser = await tx.user.delete({
                    where: { id: params.id },
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                });

                console.log("✅ Kullanıcı ve ilişkili veriler silindi:", deletedUser);
                return deletedUser;
            });

            return NextResponse.json({ 
                success: true,
                message: "Kullanıcı başarıyla silindi"
            });
        } catch (prismaError) {
            console.error("❌ Prisma silme hatası:", prismaError);
            return NextResponse.json({ 
                error: "Kullanıcı silinirken hata oluştu",
                details: prismaError.message 
            }, { status: 500 });
        }

    } catch (error) {
        console.error("❌ Kullanıcı silme hatası:", error);
        return NextResponse.json({ 
            error: "Sunucu hatası", 
            details: error.message 
        }, { status: 500 });
    }
}
