import type { ProfileData } from "@/types/portfolio";
import { DEFAULT_PROFILE } from "@/constants/profile";
import { readCmsJson, writeCmsJson } from "@/lib/storage";

export { DEFAULT_PROFILE };

/**
 * Reads profile data from configured storage (Vercel Blob, Redis, GitHub, or data/profile.json).
 * If missing, returns DEFAULT_PROFILE.
 */
export async function getProfile(): Promise<ProfileData> {
  const data = await readCmsJson<Record<string, unknown>>(
    "profile.json",
    DEFAULT_PROFILE as unknown as Record<string, unknown>,
    (val): val is Record<string, unknown> =>
      Boolean(val) && typeof val === "object" && !Array.isArray(val)
  );
  return { ...DEFAULT_PROFILE, ...(data as Partial<ProfileData>) };
}

/**
 * Saves profile data to configured storage.
 */
export async function saveProfile(data: ProfileData): Promise<void> {
  await writeCmsJson("profile.json", data);
}
