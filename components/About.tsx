"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ProfileData } from "@/types/portfolio";

export function About({ profile }: { profile: ProfileData }) {
  const [copyStatus, setCopyStatus] = useState("");
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); setCopyStatus("Email copied."); }
    catch { setCopyStatus("Could not copy. Please use the email link."); }
  }
  return (
    <section id="about" className="about-section section-spacing" aria-labelledby="about-title">
      <div><p className="eyebrow">02 / About me</p><h2 id="about-title" className="section-title">A student.<br />A developer.<br /><em>Still curious.</em></h2></div>
      <div className="about-copy">
        <p className="about-lead">I’m studying Informatics Engineering at {profile.university}.</p>
        <p>My projects move between web development, data science, and network infrastructure. I use AI to test ideas and work through problems as I build.</p>
        <p>Before university, I spent a year teaching Arabic. Explaining a difficult concept to a classroom taught me to slow down, listen, and find a clearer way to say it. I bring that same approach to software.</p>
        <dl className="about-facts"><div><dt>Based in</dt><dd>{profile.location}</dd></div><div><dt>Current focus</dt><dd>Web applications, data & AI</dd></div></dl>
        {profile.email && <div className="about-email"><a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={copyEmail} aria-label="Copy email address">{copyStatus === "Email copied." ? <Check size={17} /> : <Copy size={17} />}</button></div>}
        <p className="copy-status" role="status">{copyStatus}</p>
      </div>
    </section>
  );
}
