import type { ProfileData } from "@/types/portfolio";

export function Footer({ profile }: { profile: ProfileData }) {
  return <footer className="site-footer"><p>&copy; {new Date().getFullYear()} {profile.name}</p><a href="#top">Back to top ↑</a></footer>;
}
