import { NextResponse } from "next/server";
import { getProjects } from "@/lib/projects";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
