import Image from "next/image";
import type { ProfileData } from "@/types/portfolio";
import { isValidImageSrc, shouldBypassImageOptimization } from "@/lib/urls";

export function Portrait({ profile, preload = false }: { profile: ProfileData; preload?: boolean }) {
  const rawSrc = profile.avatarUrl?.trim() || "/profile.jpg";
  const src = isValidImageSrc(rawSrc) ? rawSrc : "/profile.jpg";

  return (
    <figure className="portrait-wrap">
      <div className="portrait-frame">
        <Image
          src={src}
          alt={`Portrait of ${profile.name}`}
          fill
          preload={preload}
          unoptimized={shouldBypassImageOptimization(src)}
          sizes="(max-width: 760px) 70vw, 380px"
          className="portrait"
        />
      </div>
      <figcaption className="portrait-caption">{profile.caption}</figcaption>
      <span className="portrait-note">{profile.note}</span>
    </figure>
  );
}
