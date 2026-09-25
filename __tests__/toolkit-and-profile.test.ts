import { describe, it, expect } from "vitest";
import { DEFAULT_SKILL_GROUPS } from "@/constants/skills";
import { DEFAULT_PROFILE } from "@/constants/profile";

describe("DEFAULT_SKILL_GROUPS constant", () => {
  it("contains 3 skill groups by default", () => {
    expect(DEFAULT_SKILL_GROUPS.length).toBe(3);
  });

  it("has valid titles and non-empty skills arrays", () => {
    for (const group of DEFAULT_SKILL_GROUPS) {
      expect(group.id).toBeTruthy();
      expect(group.title).toBeTruthy();
      expect(Array.isArray(group.skills)).toBe(true);
      expect(group.skills.length).toBeGreaterThan(0);
      for (const skill of group.skills) {
        expect(skill.id).toBeTruthy();
        expect(skill.name).toBeTruthy();
        expect(skill.desc).toBeTruthy();
      }
    }
  });

  it("contains key technologies in initial groups", () => {
    const allSkillNames = DEFAULT_SKILL_GROUPS.flatMap((g) =>
      g.skills.map((s) => s.name)
    );
    expect(allSkillNames).toContain("Next.js / React");
    expect(allSkillNames).toContain("TypeScript");
    expect(allSkillNames).toContain("Python");
    expect(allSkillNames).toContain("Git & GitHub");
  });
});

describe("DEFAULT_PROFILE constant", () => {
  it("contains required personal details", () => {
    expect(DEFAULT_PROFILE.name).toBeTruthy();
    expect(DEFAULT_PROFILE.avatarUrl).toBe("/profile.jpg");
    expect(DEFAULT_PROFILE.caption).toBeTruthy();
    expect(DEFAULT_PROFILE.note).toBeTruthy();
    expect(DEFAULT_PROFILE.email).toContain("@");
    expect(DEFAULT_PROFILE.cvUrl).toBeTruthy();
  });
});
