import fs from "fs/promises";
import path from "path";
import type { SkillGroup } from "@/types/portfolio";
import { DEFAULT_SKILL_GROUPS } from "@/constants/skills";

const DATA_DIR = path.join(process.cwd(), "data");
const SKILLS_FILE = path.join(DATA_DIR, "skills.json");

export { DEFAULT_SKILL_GROUPS };

/**
 * Reads skill groups from data/skills.json.
 * If file does not exist, returns DEFAULT_SKILL_GROUPS.
 */
export async function getSkills(): Promise<SkillGroup[]> {
  try {
    const content = await fs.readFile(SKILLS_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed as SkillGroup[];
    }
    return DEFAULT_SKILL_GROUPS;
  } catch {
    try {
      await saveSkills(DEFAULT_SKILL_GROUPS);
    } catch {
      // ignore write error in read-only environment
    }
    return DEFAULT_SKILL_GROUPS;
  }
}

/**
 * Saves skill groups to data/skills.json.
 */
export async function saveSkills(groups: SkillGroup[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SKILLS_FILE, JSON.stringify(groups, null, 2), "utf-8");
}
