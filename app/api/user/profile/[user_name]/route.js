import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req, { params }) {
  try {
    const { user_name } = params;

    const user = await prisma.user.findFirst({
      where: { user_name },
      include: {
        artistProfile: true,
        providerProfile: true,
      },
    });

    if (!user || (!user.artistProfile && !user.providerProfile)) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
