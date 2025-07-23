import NextAuth from "next-auth"
import bcrypt from 'bcryptjs'
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen e-posta ve şifre giriniz.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            provider: true,
            artist: true,
          },
        });

        if (!user) {
          throw new Error("E-mail bilgileriniz yanlış, tekrardan deneyiniz.");
        }

        const passwordValid = await bcrypt.compare(credentials.password, user.password);
        if (!passwordValid) {
          throw new Error("Şifre yanlış");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.name = user.name;
      token.email = user.email;
      token.phone = user.phone;
      token.role = user.role; // BURASI ÖNEMLİ
    }
    return token;
  },
  async session({ session, token }) {
    session.user.id = token.id;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.phone = token.phone;
    session.user.role = token.role; // BURASI DA ÖNEMLİ
    return session;
  },
},

  secret: process.env.NEXTAUTH_SECRET,
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);