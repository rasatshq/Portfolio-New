import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSkills, saveSkills } from "@/lib/skills";
import type { SkillGroup } from "@/types/portfolio";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const groups = await getSkills();
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal memuat skills" },
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
    const groups = body.groups as SkillGroup[];

    if (!Array.isArray(groups)) {
      return NextResponse.json(
        { error: "Format data tidak valid. Groups harus berupa array." },
        { status: 400 }
      );
    }

    // Validate structure
    for (const group of groups) {
      if (!group.title || !Array.isArray(group.skills)) {
        return NextResponse.json(
          { error: "Setiap grup harus memiliki title dan array skills." },
          { status: 400 }
        );
      }
    }

    await saveSkills(groups);
    return NextResponse.json({ success: true, groups });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal menyimpan skills" },
      { status: 500 }
    );
  }
}
