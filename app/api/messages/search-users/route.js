import { NextResponse } from "next/server";
import { getAuthUser } from "../../lib/auth";
import prisma from "../../lib/prisma";

export async function GET(request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: "Search query too short" }, { status: 400 });
    }

    console.log('User search query:', query);

    // Kullanıcıları ara (kendisi hariç)
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session.id } },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { user_name: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        user_name: true,
        user_photo: true,
        role: true
      },
      take: 10
    });

    console.log('Found users:', users.length);

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Kullanıcı arama hatası:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
