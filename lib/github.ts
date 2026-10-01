import type { Repository } from "@/types/portfolio";

const GITHUB_REPOSITORIES_URL =
  "https://api.github.com/users/rasatshq/repos?sort=updated&per_page=4";

export const FALLBACK_REPOSITORIES: Repository[] = [];

// Keep the public API array contract; unavailable data renders an honest empty state.
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
