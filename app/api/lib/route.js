import { NextResponse } from "next/server";
import { getAuthUser } from "./auth";

export async function GET() {
  try {
    const session = await getAuthUser();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
