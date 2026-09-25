import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProfile, saveProfile } from "@/lib/profile";
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
    const current = await getProfile();

    const updated: ProfileData = {
      ...current,
      ...body,
    };

    await saveProfile(updated);
    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
