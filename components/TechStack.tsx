import React from "react";
import { Layers } from "lucide-react";
import type { TechSkill } from "@/types/portfolio";

const techStack: TechSkill[] = [
  {
    name: "Python",
    category: "Data & Core",
    desc: "Data analysis & scripting",
  },
  {
    name: "PHP",
    category: "Backend Architecture",
    desc: "Server-side web apps",
  },
  {
    name: "JavaScript",
    category: "Frontend Interactive",
    desc: "Modern UI mechanics",
  },
  {
    name: "HTML5 / CSS3",
    category: "Visual Structure",
    desc: "Responsive layout design",
  },
  {
    name: "MySQL",
    category: "Database Engineering",
    desc: "Relational data querying",
  },
  {
    name: "Cisco Packet Tracer",
    category: "Network Topology",
    desc: "VLSM & device security",
  },
  {
    name: "Git & GitHub",
    category: "Version Control",
    desc: "Workflow & collaboration",
  },
  {
    name: "Generative AI",
    category: "Productivity",
    desc: "AI-first workflow speed",
  },
];

export function TechStack() {
  return (
    <section id="skills" className="space-y-6 scroll-mt-28">
      <h2 className="flex items-center gap-2 text-xs font-mono text-cyan-600 tracking-widest uppercase font-semibold">
        <Layers className="w-4 h-4" />
        03. Tech Arsenal &amp; Skills
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm hover:shadow-md hover:border-cyan-500/50 hover:bg-cyan-50/20 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  {tech.name}
                </span>
                <span className="text-[10px] font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 font-medium whitespace-nowrap">
                  {tech.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-normal">
                {tech.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
