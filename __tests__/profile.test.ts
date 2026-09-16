/**
 * Tests for constants/profile.ts
 * Ensures the shape stays correct so a typo in PROFILE doesn't silently
 * break every component that imports from it.
 */
import { describe, it, expect } from "vitest";
import { PROFILE } from "@/constants/profile";

describe("PROFILE constant", () => {
  it("has a non-empty name", () => {
    expect(PROFILE.name.trim()).toBeTruthy();
  });

  it("has a valid email format", () => {
    expect(PROFILE.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("has a non-empty location", () => {
    expect(PROFILE.location.trim()).toBeTruthy();
  });

  it("has a GitHub URL starting with https://github.com/", () => {
    expect(PROFILE.github).toMatch(/^https:\/\/github\.com\/.+/);
  });

  it("has a LinkedIn URL starting with https://www.linkedin.com/", () => {
    expect(PROFILE.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/.+/);
  });

  it("has a CV URL starting with /", () => {
    expect(PROFILE.cvUrl).toMatch(/^\/.+/);
  });

  it("has a non-empty university name", () => {
    expect(PROFILE.university.trim()).toBeTruthy();
  });
});
