import { NextResponse } from "next/server";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/projects";
import { saveUploadedMedia } from "@/lib/storage";
import { getStorageErrorMessage } from "@/lib/urls";

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/x-png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/pjpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

const EXT_TO_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

const ALLOWED_EXTENSIONS = new Set(Object.keys(EXT_TO_MIME));

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

    const rawExt = path.extname(file.name).toLowerCase();
    const mimeType = (file.type || "").toLowerCase();
    const mappedExt = MIME_TO_EXT[mimeType];
    const hasValidMime = Boolean(mappedExt);
    const hasValidExt = ALLOWED_EXTENSIONS.has(rawExt);

    if (!hasValidMime && !((!mimeType || mimeType === "application/octet-stream") && hasValidExt)) {
      return NextResponse.json(
        {
          error:
            "Format file tidak didukung. Harap upload PNG, JPG, JPEG, WEBP, GIF, AVIF, atau SVG.",
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
    const extension = hasValidExt ? rawExt : mappedExt || ".png";
    const safeBaseName = slugify(originalName) || "image";
    const fileName = `${safeBaseName}-${Date.now()}${extension}`;
    const resolvedMime = EXT_TO_MIME[extension] || mimeType || "image/png";

    const url = await saveUploadedMedia(fileName, buffer, resolvedMime);

    return NextResponse.json({
      success: true,
      url,
      fileName,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: getStorageErrorMessage(error, "Gagal mengunggah gambar."),
      },
      { status: 500 }
    );
  }
}
