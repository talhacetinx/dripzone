import { NextResponse } from "next/server";
import prisma from "../lib/prisma";
import { checkRateLimit } from "../lib/rate";
import { sanitizeInput } from "../lib/sanitize";
import bcrypt from 'bcryptjs'


export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.' },
      { status: 429 }
    )
  }
  
  const body = sanitizeInput(await req.json());
  
  
  const password = body.password;
  const confirmPassword = body.confirmPassword;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


  if(body.agreeTerms === false) return NextResponse.json({message: "Kullanıcı onay metnini onaylayın"}, {status: 405})
  
  const existingUser = await prisma.user.findUnique({ where: { email: body.email } })

  if(existingUser) return NextResponse.json({message: "Bu kullanıcı zaten kayıtlı"}, {status: 400})

  if(!emailRegex.test(body.email))  return NextResponse.json({message: "Yanlış E-mail Formatı"}, {status: 400})

  if (password !== confirmPassword && password.length < 6) {
    return NextResponse.json(
      { message: "Lütfen şifreleri aynı yazınız ve 6 karakterden düşük şifre belirlemeyiniz" },
      { status: 405 }
    );
  }

  if(body.user_type === "ARTIST" || body.user_type === "PROVIDER"){
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const createUser = await prisma.user.create({
      data : {
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        phone: body.phone,
        password: hashedPassword,
        role: body.user_type
      }
    })
  }else{
    return NextResponse.json({message: "Geçersiz kullanıcı tipi"}, {status:429})
  }

  return NextResponse.json(
    { message: "Kayıt başarılı." },
    { status: 200 }
  );
}
