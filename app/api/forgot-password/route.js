import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "../lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: "Yanlış E-mail Formatı" },
        { status: 400 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Bu e-posta ile kayıtlı kullanıcı bulunamadı." },
        { status: 404 }
      );
    }
    const randomAuthNumber = Math.floor(100000 + Math.random() * 900000); 

    await prisma.user.update({
      where: { email: body.email },
      data: {
        newPasswordAuth: randomAuthNumber.toString(),
      },
    });


    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.PROD_URL 
        : process.env.LOCAL_URL;
    const transporter = nodemailer.createTransport({
      host: "mail.crabsmedia.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Mert Öztürk" <${process.env.SMTP_USER}>`,
      to: body.email,
      subject: "Şifre Yenileme",
      text: "Şifrenizi yenilemek için bağlantıya tıklayın",
      html: `Şifrenizi yenileyiniz ${baseUrl}/new-password/?email=${body.email}&authCode=${randomAuthNumber}`
    });

    return NextResponse.json({
      success: true,
      message: "Şifre yenileme isteğiniz başarıyla mail adresinize yollandı.",
    },{ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}