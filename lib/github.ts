import type { Repository } from "@/types/portfolio";

const GITHUB_REPOSITORIES_URL =
  "https://api.github.com/users/rasatshq/repos?sort=updated&per_page=4";

export const FALLBACK_REPOSITORIES: Repository[] = [
  {
    id: 103,
    name: "indonesian-judol-bilstm",
    description:
      "Deep Learning BiLSTM text classifier to detect Indonesian online gambling (judol) promotions, with de-obfuscation pipeline and Streamlit SOC dashboard.",
    html_url: "https://github.com/rasatshq/indonesian-judol-bilstm",
    stargazers_count: 0,
    language: "Python",
    updated_at: "2025-02-18T14:30:00Z",
  },
  {
    id: 104,
    name: "prince-ecommerce",
    description:
      "Full-stack e-commerce platform with Laravel 12, Livewire 3, Filament 5, product variant stock, guest-to-user cart merge, and Midtrans Snap checkout.",
    html_url: "https://github.com/rasatshq/prince-ecommerce",
    stargazers_count: 0,
    language: "PHP",
    updated_at: "2025-02-10T09:15:00Z",
  },
  {
    id: 100,
    name: "Aplikasi-Pos-kasir",
    description:
      "A modern responsive Point of Sale (POS) cashier web application built with JavaScript.",
    html_url: "https://github.com/rasatshq/Aplikasi-Pos-kasir",
    stargazers_count: 0,
    language: "JavaScript",
    updated_at: "2024-11-25T16:45:00Z",
  },
  {
    id: 101,
    name: "cafe-manjaro",
    description:
      "A responsive cashier POS system and cafe landing page interface with dark aesthetics.",
    html_url: "https://github.com/rasatshq/cafe-manjaro",
    stargazers_count: 1,
    language: "JavaScript",
    updated_at: "2024-10-14T11:20:00Z",
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
