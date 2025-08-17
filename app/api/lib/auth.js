import jwt from "jsonwebtoken";
import prisma from "./prisma";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "default_secret";

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

const _getAuthUser = unstable_cache(
  async (userId) => {
    return prisma.user.findUnique({ where: { id: userId } });
  },
  ["auth-user-v2"], // Cache key'i değiştir
  { revalidate: 10 } // Cache süresini kısalt
);

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload?.id) return null;

  const user = await _getAuthUser(payload.id);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    user_name: user.user_name,
    role: user.role,
    user_photo: user.user_photo, // Profil fotoğrafını da ekle
  };
}