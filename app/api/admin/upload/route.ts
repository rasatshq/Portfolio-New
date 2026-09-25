import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/projects";

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format file tidak didukung. Harap upload PNG, JPG, JPEG, WEBP, GIF, atau SVG.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimum 10 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = path.parse(file.name).name;
    const extension = path.extname(file.name).toLowerCase() || ".png";
    const safeBaseName = slugify(originalName) || "project";
    const fileName = `${safeBaseName}-${Date.now()}${extension}`;

    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.join(publicDir, fileName);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/${fileName}`,
      fileName,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal mengunggah gambar." },
      { status: 500 }
    );
  }
}
