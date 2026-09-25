import fs from "fs/promises";
import path from "path";
import type { ProfileData } from "@/types/portfolio";
import { DEFAULT_PROFILE } from "@/constants/profile";

const DATA_DIR = path.join(process.cwd(), "data");
const PROFILE_FILE = path.join(DATA_DIR, "profile.json");

export { DEFAULT_PROFILE };

/**
 * Reads profile data from data/profile.json.
 * If file does not exist, returns DEFAULT_PROFILE.
 */
export async function getProfile(): Promise<ProfileData> {
  try {
    const content = await fs.readFile(PROFILE_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object") {
      return { ...DEFAULT_PROFILE, ...parsed };
    }
    return DEFAULT_PROFILE;
  } catch {
    try {
      await saveProfile(DEFAULT_PROFILE);
    } catch {
      // ignore write error in read-only environment
    }
    return DEFAULT_PROFILE;
  }
}

/**
 * Saves profile data to data/profile.json.
 */
export async function saveProfile(data: ProfileData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PROFILE_FILE, JSON.stringify(data, null, 2), "utf-8");
}
