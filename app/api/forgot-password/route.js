import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
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


    const baseUrl = process.env.PROD_URL;
    
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `${baseUrl}/new-password/?email=${encodeURIComponent(body.email)}&authCode=${randomAuthNumber}`;

    const logoPath = path.join(process.cwd(), "public", "TpazLayer 2-topaz-enhance-min.png");

    await transporter.sendMail({
      from: `Dripzone Music Şifre Yenileme İsteği <${process.env.SMTP_USER}>`,
      to: body.email,
      subject: "Şifre Yenileme Talebi - Dripzone",
      text: `Şifrenizi yenilemek için aşağıdaki bağlantıyı kullanın: ${resetUrl}`,
      attachments: [
        {
          filename: "dripzone-logo.png",
          path: logoPath,
          cid: "dripzone-logo@dripzone"
        }
      ],
      html: `
        <!doctype html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f6f8fb; margin:0; padding:0; }
            .container { max-width:600px; margin:28px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08); }
            .header { padding:20px; text-align:center; background:linear-gradient(90deg,#0f172a 0%,#111827 100%); }
            .logo { width:84px; height:auto; display:block; margin:0 auto 8px; }
            .brand { color:#ffffff; font-size:20px; font-weight:700; margin:0; }
            .content { padding:28px 32px; color:#0f172a; }
            h1 { font-size:20px; margin:0 0 12px; }
            p { margin:0 0 16px; line-height:1.5; color:#334155; }
            .btn {   padding: 0.75rem 1.5rem;
                  background: linear-gradient(to right, #0ea5a4, #34d399);
                  color: #000;
                  font-weight: 600;
                  border-radius: 12px;
                  border: 2px solid #0ea5a4;
                  box-shadow: 0 8px 24px rgba(250,204,21,0.25); }
            .small { font-size:12px; color:#94a3b8; margin-top:18px; }
            .footer { background:#f8fafc; padding:16px 24px; text-align:center; font-size:13px; color:#64748b; }
            .muted { color:#94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:dripzone-logo@dripzone" alt="Dripzone" class="logo" />
              <div class="brand">Dripzone Music</div>
            </div>
            <div class="content">
              <h1>Şifre Yenileme Talebi</h1>
              <p>Merhaba,</p>
              <p>Bu e-posta hesabınız için bir şifre yenileme isteği alındı. Aşağıdaki butona tıklayarak yeni şifrenizi oluşturabilirsiniz. Buton yalnızca sınırlı süre için geçerli olacaktır.</p>
              <p style="text-align:center; margin:20px 0;">
                <a class="btn" href="${resetUrl}" target="_blank" rel="noopener noreferrer">Şifreyi Yenile</a>
              </p>
              <p class="small">Butona tıklayamıyorsanız, aşağıdaki bağlantıyı kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
              <p class="small muted"><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>
              <p class="small">Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende kalacaktır.</p>
            </div>
            <div class="footer">
              <div>Dripzone Music • Müzik Dünyasının Yeni Nesil Pazar Yeri</div>
              <div class="muted">© 2025 Dripzone Music</div>
            </div>
          </div>
        </body>
        </html>
      `,
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