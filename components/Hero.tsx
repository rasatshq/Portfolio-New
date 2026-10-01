import { Portrait } from "@/components/Portrait";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ProfileData } from "@/types/portfolio";

export function Hero({ profile }: { profile: ProfileData }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Informatics Engineering Student / Developer</p>
        <h1 id="hero-title">{profile.name}<span className="hero-period">.</span></h1>
        <p className="hero-intro">I build web applications and work with data. I care about understanding how things work, from the interface to the network underneath.</p>
        <div className="hero-actions">
          <a className="button-primary" href="#projects">View my work <ArrowDown size={17} aria-hidden="true" /></a>
          {profile.github && <a className="button-text" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={16} aria-hidden="true" /></a>}
        </div>
        <p className="hero-location">Based in {profile.location}<br />Studying at {profile.university}</p>
      </div>
      <Portrait profile={profile} preload />
      <div className="hero-bottom"><span>Web development</span><span>Data & AI</span><span>Network engineering</span><span className="hero-index">Portfolio / 01</span></div>
    </section>
  );
}
