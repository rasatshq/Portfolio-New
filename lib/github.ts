import type { Repository } from "@/types/portfolio";

const GITHUB_REPOSITORIES_URL =
  "https://api.github.com/users/rasatshq/repos?sort=updated&per_page=4";

export const FALLBACK_REPOSITORIES: Repository[] = [
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

/**
 * Fetches the latest public repositories from GitHub.
 * Aborts automatically after 5 s to avoid hanging the render.
 * Falls back to FALLBACK_REPOSITORIES on any network error, non-OK status,
 * or empty response -- so this function never throws.
 */
export async function getGithubRepos(): Promise<Repository[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5_000);

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-rashad",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(GITHUB_REPOSITORIES_URL, {
      headers,
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return FALLBACK_REPOSITORIES;

    const repositories: unknown = await response.json();
    if (!Array.isArray(repositories) || repositories.length === 0) {
      return FALLBACK_REPOSITORIES;
    }

    return repositories as Repository[];
  } catch {
    return FALLBACK_REPOSITORIES;
  } finally {
    clearTimeout(timeoutId);
  }
}
