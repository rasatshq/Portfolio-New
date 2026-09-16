/**
 * Tests for app/api/github-repos/route.ts
 * Mocks getGithubRepos() so the route handler is tested in isolation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FALLBACK_REPOSITORIES } from "@/lib/github";

// Mock the module before importing the route
vi.mock("@/lib/github", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/github")>();
  return {
    ...actual,
    getGithubRepos: vi.fn(),
  };
});

// Import after mock is registered
import { getGithubRepos } from "@/lib/github";
import { GET } from "@/app/api/github-repos/route";

const MOCK_REPOS = [
  {
    id: 1,
    name: "mock-repo",
    description: "mock",
    html_url: "https://github.com/rasatshq/mock-repo",
    stargazers_count: 0,
    language: "TypeScript",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

describe("GET /api/github-repos", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 with live repos from getGithubRepos()", async () => {
    vi.mocked(getGithubRepos).mockResolvedValueOnce(MOCK_REPOS);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(MOCK_REPOS);
  });

  it("returns 200 with fallback repos when getGithubRepos() returns fallback", async () => {
    vi.mocked(getGithubRepos).mockResolvedValueOnce(FALLBACK_REPOSITORIES);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(FALLBACK_REPOSITORIES);
  });

  it("sets Cache-Control header", async () => {
    vi.mocked(getGithubRepos).mockResolvedValueOnce(MOCK_REPOS);

    const response = await GET();

    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
  });

  it("always returns an array (never null/undefined)", async () => {
    vi.mocked(getGithubRepos).mockResolvedValueOnce([]);

    const response = await GET();
    const body = await response.json();

    expect(Array.isArray(body)).toBe(true);
  });
});
