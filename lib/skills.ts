import type { SkillGroup } from "@/types/portfolio";
import { DEFAULT_SKILL_GROUPS } from "@/constants/skills";
import { readCmsJson, writeCmsJson } from "@/lib/storage";

export { DEFAULT_SKILL_GROUPS };

/**
 * Reads skill groups from configured storage (Vercel Blob, Redis, GitHub, or data/skills.json).
 * If missing, returns DEFAULT_SKILL_GROUPS.
 */
export async function getSkills(): Promise<SkillGroup[]> {
  return readCmsJson<SkillGroup[]>(
    "skills.json",
    DEFAULT_SKILL_GROUPS,
    (val): val is SkillGroup[] => Array.isArray(val)
  );
}

/**
 * Saves skill groups to configured storage.
 */
export async function saveSkills(groups: SkillGroup[]): Promise<void> {
  await writeCmsJson("skills.json", groups);
}
