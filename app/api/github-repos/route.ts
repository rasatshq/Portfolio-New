import { NextResponse } from "next/server";
import { getGithubRepos } from "@/lib/github";

export async function GET() {
  const repositories = await getGithubRepos();
  return NextResponse.json(repositories, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

