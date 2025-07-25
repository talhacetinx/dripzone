import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "dripzome-secret");

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

export async function middleware(request) {
  const cookieHeader = request.headers.get("cookie");
  const tokenMatch = cookieHeader?.match(/token=([^;]+)/);
  const token = tokenMatch?.[1];

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}