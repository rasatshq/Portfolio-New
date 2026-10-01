/**
 * Tests for lib/github.ts — getGithubRepos()
 *
 * async Server Component (GitHubRepos.tsx) cannot be unit-tested with
 * Vitest+RTL per the official Next.js docs; E2E tests cover that path.
 * These tests focus on the pure fetch logic that getGithubRepos() contains.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getGithubRepos, FALLBACK_REPOSITORIES } from "@/lib/github";

// ─── helpers ────────────────────────────────────────────────────────────────

function makeResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const VALID_REPOS = [
  {
    id: 1,
    name: "test-repo",
    description: "A test repo",
    html_url: "https://github.com/rasatshq/test-repo",
    stargazers_count: 3,
    language: "TypeScript",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// ─── test suite ─────────────────────────────────────────────────────────────

describe("getGithubRepos()", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns live repos when GitHub API responds with a non-empty array", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse(VALID_REPOS));

    const result = await getGithubRepos();

    expect(result).toEqual(VALID_REPOS);
  });

  it("returns fallback when GitHub API responds with non-OK status (e.g. 403 rate-limit)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse({}, 403));

    const result = await getGithubRepos();

    expect(result).toEqual(FALLBACK_REPOSITORIES);
    expect(result).toHaveLength(0);
  });

  it("returns fallback when GitHub API returns an empty array", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([]));

    const result = await getGithubRepos();

    expect(result).toEqual(FALLBACK_REPOSITORIES);
  });

  it("returns fallback when GitHub API returns non-array JSON", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse({ message: "Not Found" }, 200));

    const result = await getGithubRepos();

    expect(result).toEqual(FALLBACK_REPOSITORIES);
  });

  it("returns fallback when fetch throws a network error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network failure"));

    const result = await getGithubRepos();

    expect(result).toEqual(FALLBACK_REPOSITORIES);
  });

  it("returns fallback when fetch is aborted (timeout)", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(
      new DOMException("The operation was aborted", "AbortError"),
    );

    const result = await getGithubRepos();

    expect(result).toEqual(FALLBACK_REPOSITORIES);
  });

  it("never throws — always resolves", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("catastrophic failure"));

    await expect(getGithubRepos()).resolves.toBeDefined();
  });

  it("sends the correct Accept and User-Agent headers", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse(VALID_REPOS));

    await getGithubRepos();

    const [, init] = vi.mocked(fetch).mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(headers["Accept"]).toBe("application/vnd.github+json");
    expect(headers["User-Agent"]).toBe("portfolio-rashad");
  });

  it("adds Authorization header when GITHUB_TOKEN env var is set", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-token-123");
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse(VALID_REPOS));

    await getGithubRepos();

    const [, init] = vi.mocked(fetch).mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-token-123");

    vi.unstubAllEnvs();
  });

  it("does not add Authorization header when GITHUB_TOKEN is not set", async () => {
    vi.unstubAllEnvs();
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse(VALID_REPOS));

    await getGithubRepos();

    const [, init] = vi.mocked(fetch).mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(headers["Authorization"]).toBeUndefined();
  });
});
