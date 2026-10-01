import Image from "next/image";
import type { ProfileData } from "@/types/portfolio";

export function Portrait({ profile, preload = false }: { profile: ProfileData; preload?: boolean }) {
  return (
    <figure className="portrait-wrap">
      <div className="portrait-frame">
        <Image src={profile.avatarUrl || "/profile.jpg"} alt={`Portrait of ${profile.name}`} fill preload={preload} sizes="(max-width: 760px) 70vw, 380px" className="portrait" />
      </div>
      <figcaption className="portrait-caption">{profile.caption}</figcaption>
      <span className="portrait-note">{profile.note}</span>
    </figure>
  );
}
