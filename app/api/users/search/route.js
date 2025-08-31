import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import {getAuthUser} from "../../lib/auth";

// Kullanıcı arama
export async function GET(request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ users: [] });
    }

    // Kullanıcıları ara (kendisi hariç)
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session.id } }, // Kendisini hariç tut
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { user_name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ]
          },
          { isApproved: true } // Sadece onaylanmış kullanıcılar
        ]
      },
      select: {
        id: true,
        name: true,
        user_name: true,
        user_photo: true,
        role: true,
        email: true
      },
      take: 20, // Maksimum 20 sonuç
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ users });

  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
