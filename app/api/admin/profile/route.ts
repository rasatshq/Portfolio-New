import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getProfile, saveProfile } from "@/lib/profile";
import {
  getStorageErrorMessage,
  normalizeImageInput,
  normalizeLinkUrl,
} from "@/lib/urls";
import type { ProfileData } from "@/types/portfolio";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await getProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal memuat profil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Format data profil tidak valid." },
        { status: 400 }
      );
    }

    const current = await getProfile();
    const updated: ProfileData = { ...current };

    const textFields = [
      "name",
      "caption",
      "note",
      "email",
      "location",
      "university",
    ] as const;

    for (const field of textFields) {
      if (field in body && typeof body[field] === "string") {
        updated[field] = body[field].trim();
      }
    }

    if ("avatarUrl" in body) {
      const avatarCheck = normalizeImageInput(body.avatarUrl);
      if (!avatarCheck.ok) {
        return NextResponse.json(
          { error: avatarCheck.error || "URL foto profil tidak valid." },
          { status: 400 }
        );
      }
      updated.avatarUrl = avatarCheck.value || "/profile.jpg";
    }

    const linkFields = [
      { key: "github", label: "URL GitHub" },
      { key: "linkedin", label: "URL LinkedIn" },
      { key: "cvUrl", label: "Link CV" },
    ] as const;

    for (const { key, label } of linkFields) {
      if (key in body) {
        const linkCheck = normalizeLinkUrl(body[key]);
        if (!linkCheck.ok) {
          return NextResponse.json(
            { error: `${label}: ${linkCheck.error}` },
            { status: 400 }
          );
        }
        updated[key] = linkCheck.value;
      }
    }

    await saveProfile(updated);
    revalidatePath("/");
    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    return NextResponse.json(
      { error: getStorageErrorMessage(error, "Gagal memperbarui profil") },
      { status: 500 }
    );
  }
}
