import React from "react";
import { GraduationCap, ArrowUpRight, Calendar, Briefcase, MapPin } from "lucide-react";
import type { ExperienceItem } from "@/types/portfolio";

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
    <section id="experience" className="space-y-6 scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xs font-mono text-cyan-600 tracking-widest uppercase font-semibold">
          <GraduationCap className="w-4 h-4" />
          02. Education &amp; Experience
        </h2>
        <a
          href="/cv-rashad-shaquille-taofik.pdf"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono text-cyan-600 hover:text-cyan-700 flex items-center gap-1.5 transition-colors font-medium"
        >
          Full Curriculum Vitae <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {experienceAndEducation.map((item, idx) => (
          <div
            key={idx}
            className={`p-7 sm:p-8 rounded-3xl border border-slate-200/80 bg-gradient-to-b ${item.accent} backdrop-blur-xl shadow-xl shadow-slate-200/40 flex flex-col justify-between space-y-6 group hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span
                  className={`text-[10px] font-mono px-3 py-1 rounded-full border font-medium ${item.badgeColor}`}
                >
                  {item.type}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                  {item.period}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  {item.role}
                </h3>
                <p className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                  {item.type === "Education" ? (
                    <GraduationCap className="w-4 h-4 text-cyan-600 shrink-0" />
                  ) : (
                    <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                  )}
                  <span>{item.institution}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                  {item.location}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
