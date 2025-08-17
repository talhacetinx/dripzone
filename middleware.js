import { NextResponse } from "next/server";


function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    // Base64 decode
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = decodeJWT(token);
  
  if (!decoded || !decoded.id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  if (pathname.startsWith("/admin")) {
    if (decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    console.log("✅ Admin yetkisi doğrulandı");
  }

  if (pathname.startsWith("/dashboard")) {
    const allowedRoles = ["PROVIDER", "ARTIST", "ADMIN"];
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};