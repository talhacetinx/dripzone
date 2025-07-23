import NextAuth from "next-auth";
import { authOptions } from "../../lib/authOptions";

const handler = NextAuth(authOptions);

export function GET(req) {
  return handler(req);
}

export function POST(req) {
  return handler(req);
}
