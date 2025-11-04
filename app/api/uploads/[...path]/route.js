import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const filePath = path.join(process.cwd(), "uploads", ...params.path);
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
    };

    return new NextResponse(file, {
      headers: {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Dosya bulunamadı", { status: 404 });
  }
}