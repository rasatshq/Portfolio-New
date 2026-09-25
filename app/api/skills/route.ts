import { NextResponse } from "next/server";
import { getSkills } from "@/lib/skills";

export async function GET() {
  try {
    const skills = await getSkills();
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal memuat data skill" },
      { status: 500 }
    );
  }
}
