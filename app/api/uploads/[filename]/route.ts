import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { readUploadedMedia } from "@/lib/storage";

const EXT_TO_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safeName = path.basename(filename);

  if (
    !safeName ||
    safeName !== filename ||
    safeName.includes("..") ||
    !/^[a-zA-Z0-9._-]+$/.test(safeName)
  ) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const ext = path.extname(safeName).toLowerCase();
  const contentType = EXT_TO_MIME[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const uploadPath = path.join(process.cwd(), "data", "uploads", safeName);
  const publicPath = path.join(process.cwd(), "public", safeName);

  const readCandidate = async (target: string) => {
    try {
      return await fs.readFile(/*turbopackIgnore: true*/ target);
    } catch {
      return null;
    }
  };

  const data =
    (await readCandidate(uploadPath)) ??
    (await readCandidate(publicPath)) ??
    (await readUploadedMedia(safeName));
  if (data) {
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    };
    if (ext === ".svg") {
      headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'";
    }
    return new NextResponse(new Uint8Array(data), { status: 200, headers });
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 });
}
