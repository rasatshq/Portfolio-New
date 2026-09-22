import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { ExperienceItem } from "@/types/portfolio";
import { PROFILE } from "@/constants/profile";


const experienceAndEducation: ExperienceItem[] = [
  {
    type: "Education",
    institution: "Universitas Komputer Indonesia (UNIKOM)",
    role: "Bachelor of Informatics Engineering",
    period: "2024 — Present",
    location: "Bandung, West Java",
    description:
      "Developing a rigorous foundation in software logic, database engineering, and data-driven systems. Actively integrating AI-assisted workflows to accelerate prototyping and problem solving.",
    tags: [
      "Data Science",
      "Python (NumPy)",
      "Cisco Netacad",
      "Web Development",
      "MySQL",
    ],
    accent: "from-cyan-500/10 via-cyan-500/[0.02] to-white",
    badgeColor: "text-cyan-800 bg-cyan-50 border-cyan-200",
  },
  {
    type: "Experience",
    institution: "Pesantren Islam Hidayatunnajah",
    role: "Arabic Language Teacher (Service Year)",
    period: "June 2023 — July 2024",
    location: "Bekasi Regency, West Java",
    description:
      "Dedicated a full year to educating students, honing public speaking, classroom management, and structured discipline. Simplified complex linguistic concepts with high reliability and administrative leadership.",
    tags: [
      "Classroom Management",
      "Public Speaking",
      "Curriculum Delivery",
      "Discipline & Leadership",
    ],
    accent: "from-indigo-500/10 via-indigo-500/[0.02] to-white",
    badgeColor: "text-indigo-800 bg-indigo-50 border-indigo-200",
  },
];

export function Experience() {
  return (
    <section id="experience" className="section-spacing experience-section">
      <div className="section-heading"><div><p className="eyebrow">03 / THE JOURNEY</p><h2 className="section-title">Learning. Teaching.<br /><em>Moving forward.</em></h2></div><a className="button-text" href={PROFILE.cvUrl} target="_blank" rel="noreferrer">Full Curriculum Vitae <ArrowUpRight size={17} /></a></div>
      <div className="timeline">{experienceAndEducation.map(item => <article key={item.role} className="timeline-row"><div className="timeline-date"><span className="eyebrow">{item.type}</span><p>{item.period}</p></div><div><h3>{item.role}</h3><p className="institution">{item.institution}</p><p className="timeline-location">{item.location}</p><p className="timeline-description">{item.description}</p><div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div>
    </section>
  );
}
