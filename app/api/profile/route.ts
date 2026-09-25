import { NextResponse } from "next/server";
import { getProfile } from "@/lib/profile";

export async function GET() {
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
