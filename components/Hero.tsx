import Image from "next/image";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { PROFILE } from "@/constants/profile";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" /> OPEN TO IDEAS & COLLABORATION</p>
        <h1 id="hero-title">Building thoughtful <em>digital</em> experiences.</h1>
        <p className="hero-intro">Hi, I’m <strong>Rashad Shaquille Taofik.</strong> An Informatics student turning curiosity into useful products through code, data, and AI.</p>
        <div className="hero-actions">
          <a className="button-primary" href="#projects">Explore Projects <ArrowUpRight size={18} /></a>
          <a className="button-text" href={PROFILE.cvUrl} target="_blank" rel="noreferrer">Download CV <ArrowDown size={16} /></a>
        </div>
        <p className="hero-location"><MapPin size={14} /> {PROFILE.location} <span> / </span> UNIKOM</p>
      </div>
      <div className="portrait-wrap">
        <div className="portrait-frame">
          <Image src="/profile.jpg" alt={PROFILE.name} fill priority sizes="(max-width: 760px) 85vw, 420px" className="portrait" />
          <div className="portrait-caption"><span>A curious mind.<br />A builder at heart.</span><ArrowUpRight size={28} /></div>
        </div>
        <span className="portrait-note">CODE. CREATE. KEEP LEARNING.</span>
        <div className="portrait-stamp" aria-hidden="true">✳</div>
      </div>
      <div className="hero-bottom"><span>WEB DEVELOPMENT</span><span>DATA & AI</span><span>NETWORK ENGINEERING</span><a href="#projects" aria-label="Scroll to projects"><ArrowDown size={18} /></a></div>
    </section>
  );
}
