import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

export async function saveBase64Image(dataUrl, folder = "profile-page") {
  const matches = dataUrl?.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  if (!matches || matches.length !== 3)
    throw new Error("Geçersiz görsel formatı");

  const mimeType = matches[1];
  const base64Data = matches[2];
  const extension = mimeType.split("/")[1].toLowerCase();
  const allowedTypes = ["png", "jpeg", "jpg", "webp"];

  if (!allowedTypes.includes(extension))
    throw new Error("Desteklenmeyen dosya türü");

  const buffer = Buffer.from(base64Data, "base64");
  if (buffer.length > 5 * 1024 * 1024)
    throw new Error("Dosya çok büyük (max 5MB)");

  const uniqueName = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;
  const uploadRoot = path.join(process.cwd(), "uploads", folder);

  await fs.mkdir(uploadRoot, { recursive: true });
  const filePath = path.join(uploadRoot, uniqueName);
  await fs.writeFile(filePath, buffer);

  // Tarayıcıdan erişim yolu
  const fileUrl = `/api/uploads/${folder}/${uniqueName}`;
  return fileUrl;
}