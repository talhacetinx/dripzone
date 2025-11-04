import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export async function POST(request) {
  try {
    const form = formidable({
      multiples: false,
      // Save uploaded files into runtime uploads folder so they are served via /api/uploads
      uploadDir: path.join(process.cwd(), "uploads"),
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(request.nextUrl ? request : request, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

  const file = files.file[0];
  const fileName = path.basename(file.filepath);
  const fileUrl = `/api/uploads/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}