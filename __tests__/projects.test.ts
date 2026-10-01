import { describe, it, expect, vi, beforeEach } from "vitest";
import { DEFAULT_PROJECTS } from "@/constants/projects";
import { slugify } from "@/lib/projects";
import { verifyAdminPassword, generateExpectedSessionToken } from "@/lib/auth";

describe("DEFAULT_PROJECTS constant", () => {
  it("contains at least 5 default projects", () => {
    expect(DEFAULT_PROJECTS.length).toBeGreaterThanOrEqual(5);
  });

  it("ensures each project has required fields", () => {
    for (const proj of DEFAULT_PROJECTS) {
      expect(proj.id).toBeTruthy();
      expect(proj.title).toBeTruthy();
      expect(proj.category).toBeTruthy();
      expect(proj.description).toBeTruthy();
      expect(Array.isArray(proj.tags)).toBe(true);
      expect(proj.tags.length).toBeGreaterThan(0);
    }
  });

  it("ensures all project IDs in defaults are unique", () => {
    const ids = DEFAULT_PROJECTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("slugify() helper", () => {
  it("converts titles to lowercase slug format", () => {
    expect(slugify("Prince E-Commerce")).toBe("prince-e-commerce");
    expect(slugify("Photobooth Online 2026")).toBe("photobooth-online-2026");
    expect(slugify("AI & Machine Learning (Deep Learning!)")).toBe("ai-machine-learning-deep-learning");
  });

  it("handles whitespace and special characters", () => {
    expect(slugify("   Multiple   Spaces   ")).toBe("multiple-spaces");
    expect(slugify("hello---world")).toBe("hello-world");
  });
});

describe("Admin Authentication", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_PASSWORD", "testpass123");
  });

  it("verifies the correct password", () => {
    expect(verifyAdminPassword("testpass123")).toBe(true);
    expect(verifyAdminPassword("  testpass123  ")).toBe(true);
  });

  it("handles whitespace or quotes in environment variable", () => {
    vi.stubEnv("ADMIN_PASSWORD", "  quotedpass  ");
    expect(verifyAdminPassword("quotedpass")).toBe(true);

    vi.stubEnv("ADMIN_PASSWORD", '"doublequoted"');
    expect(verifyAdminPassword("doublequoted")).toBe(true);
  });

  it("rejects an incorrect password", () => {
    expect(verifyAdminPassword("wrongpass")).toBe(false);
    expect(verifyAdminPassword("")).toBe(false);
  });

  it("generates deterministic session tokens", () => {
    const token1 = generateExpectedSessionToken();
    const token2 = generateExpectedSessionToken();
    expect(token1).toBe(token2);
    expect(token1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex string
  });
});
