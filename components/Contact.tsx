import { ArrowUpRight } from "lucide-react";
import type { ProfileData } from "@/types/portfolio";

export function Contact({ profile }: { profile: ProfileData }) {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <p className="eyebrow">06 / Get in touch</p>
      <div className="contact-heading"><h2 id="contact-title">Have something<br />in mind?</h2><p>Tell me about your project,<br />ask about my work,<br />or just say hello.</p></div>
      <div className="contact-bottom">
        {profile.email && <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={24} aria-hidden="true" /></a>}
        <div className="contact-socials">{profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>}</div>
      </div>
    </section>
  );
}
