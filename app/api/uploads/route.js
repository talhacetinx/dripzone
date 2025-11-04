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
      uploadDir: path.join(process.cwd(), "public/uploads"),
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
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}