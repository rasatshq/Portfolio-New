import type { ProfileData } from "@/types/portfolio";

/**
 * Single source of truth for personal / contact data.
 * Used as fallback if data/profile.json is not yet initialized.
 */
export const DEFAULT_PROFILE: ProfileData = {
  name: "Rashad Shaquille Taofik",
  avatarUrl: "/profile.jpg",
  caption: "A curious mind.\nA builder at heart.",
  note: "CODE. CREATE. KEEP LEARNING.",
  email: "rashadshaq17@gmail.com",
  location: "Bandung, West Java",
  university: "Universitas Komputer Indonesia (UNIKOM)",
  cvUrl: "/cv-rashad-shaquille-taofik.pdf",
  github: "https://github.com/rasatshq",
  linkedin: "https://www.linkedin.com/in/rashad-shaquille-taofik",
};

export const PROFILE = DEFAULT_PROFILE;
