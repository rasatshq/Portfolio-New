"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { PROFILE } from "@/constants/profile";

export function About() {
  const [copyStatus, setCopyStatus] = useState("");
  async function copyEmail() {
    try { await navigator.clipboard.writeText(PROFILE.email); setCopyStatus("Email copied!"); }
    catch { setCopyStatus("Could not copy. You can use the email link below."); }
  }
  return (
    <section id="about" className="about-section section-spacing">
      <div><p className="eyebrow">02 / A LITTLE ABOUT ME</p><h2 className="section-title">Curiosity drives.<br /><em>Purpose guides.</em></h2><p className="about-signature">Rashad Shaquille Taofik</p></div>
      <div className="about-copy"><p>I am an <strong>Informatics Engineering student at {PROFILE.university}</strong>, exploring the intersection of web development, data science, and network infrastructure.</p><p>I integrate AI into my workflow to explore ideas, solve problems, and build practical software. A year of teaching Arabic shaped how I communicate, lead, and make complex ideas easier to understand.</p><p>Today, I’m developing scalable software and data-driven solutions — always learning, always building.</p><div className="about-email"><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a><button onClick={copyEmail} aria-label="Copy email address">{copyStatus === "Email copied!" ? <Check size={17} /> : <Copy size={17} />}</button></div><p className="copy-status" role="status">{copyStatus}</p></div>
    </section>
  );
}
