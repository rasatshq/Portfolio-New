import { NextResponse } from "next/server";

const GITHUB_REPOSITORIES_URL =
  "https://api.github.com/users/rasatshq/repos?sort=updated&per_page=4";

const FALLBACK_REPOSITORIES = [
  {
    id: 100,
    name: "Aplikasi-Pos-kasir",
    description:
      "A modern responsive Point of Sale (POS) cashier web application built with JavaScript.",
    html_url: "https://github.com/rasatshq/Aplikasi-Pos-kasir",
    stargazers_count: 0,
    language: "JavaScript",
    updated_at: new Date().toISOString(),
  },
  {
    id: 101,
    name: "cafe-manjaro",
    description:
      "A responsive cashier POS system and cafe landing page interface with dark aesthetics.",
    html_url: "https://github.com/rasatshq/cafe-manjaro",
    stargazers_count: 1,
    language: "JavaScript",
    updated_at: new Date().toISOString(),
  },
  {
    id: 102,
    name: "Portfolio-New",
    description:
      "Modern high-performance developer portfolio built with Next.js 16, React 19, and Tailwind CSS v4.",
    html_url: "https://github.com/rasatshq/Portfolio-New",
    stargazers_count: 1,
    language: "TypeScript",
    updated_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-rashad",
    };

    // Optional 100% free personal access token for higher rate limits (5,000 req/hr)
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(GITHUB_REPOSITORIES_URL, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // Graceful fallback if rate-limited or unavailable
      return NextResponse.json(FALLBACK_REPOSITORIES, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    const repositories: unknown = await response.json();
    if (!Array.isArray(repositories) || repositories.length === 0) {
      return NextResponse.json(FALLBACK_REPOSITORIES, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    return NextResponse.json(repositories, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    // Return fallback on any unexpected network exception
    return NextResponse.json(FALLBACK_REPOSITORIES, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }
}
