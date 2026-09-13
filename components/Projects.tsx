"use client";

import React, { useState } from "react";
import { Cpu, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/portfolio";

const projects: Project[] = [
  {
    title: "Aplikasi POS Kasir",
    category: "Frontend",
    type: "Web POS System",
    description:
      "A modern responsive Point of Sale (POS) cashier web application built with clean modular JavaScript, supporting product transaction handling, order calculations, and streamlined checkout.",
    tags: ["JavaScript", "HTML5", "CSS3", "POS System"],
    githubUrl: "https://github.com/rasatshq/Aplikasi-Pos-kasir",
    accent: "from-cyan-500/10 via-teal-500/[0.03] to-white",
    glow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
  },
  {
    title: "Cafe Manjaro Web Interface",
    category: "Frontend",
    type: "Interactive POS & UI",
    description:
      "A responsive cashier system and cafe landing page focused on intuitive order workflows and a sleek modern dark interface.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/rasatshq/cafe-manjaro",
    accent: "from-cyan-500/10 via-blue-500/[0.03] to-white",
    glow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
  },
  {
    title: "Interactive Web Music Player",
    category: "Frontend",
    type: "Audio Web App",
    description:
      "A responsive web-based interactive music player featuring dynamic audio playback controls, sleek UI/UX aesthetics, and structured local asset pathing.",
    tags: ["JavaScript", "HTML5", "CSS3", "Audio UI"],
    githubUrl: "https://github.com/rasatshq",
    accent: "from-amber-500/10 via-orange-500/[0.03] to-white",
    glow: "hover:border-amber-500/50 hover:shadow-amber-500/10",
  },
  {
    title: "Network Architecture & Security Lab",
    category: "Networking",
    type: "Cisco Infrastructure",
    description:
      "Enterprise-scale network topology design in Cisco Packet Tracer incorporating Variable Length Subnet Masking (VLSM) and switch port security protocols.",
    tags: ["Cisco Packet Tracer", "VLSM", "Port Security", "CCNA"],
    accent: "from-emerald-500/10 via-teal-500/[0.03] to-white",
    glow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
  {
    title: "Data Science & Processing Lab",
    category: "Data Science",
    type: "Data Pipeline",
    description:
      "Raw dataset cleaning (data scrubbing), missing/anomaly value handling, and exploratory data analysis using Python and the NumPy ecosystem.",
    tags: ["Python", "NumPy", "Data Scrubbing", "EDA"],
    accent: "from-indigo-500/10 via-purple-500/[0.03] to-white",
    glow: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
  },
];

export function Projects() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <section id="projects" className="space-y-6 scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xs font-mono text-cyan-600 tracking-widest uppercase font-semibold">
          <Cpu className="w-4 h-4" />
          04. Featured Projects
        </h2>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-mono">
          {["All", "Frontend", "Networking", "Data Science"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-cyan-500 text-white font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project, idx) => (
          <div
            key={idx}
            className={`group p-6 sm:p-7 rounded-3xl border border-slate-200/80 bg-gradient-to-b ${project.accent} shadow-xl shadow-slate-200/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] ${project.glow} flex flex-col justify-between space-y-6`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 font-medium">
                  {project.type}
                </span>
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    aria-label={`View ${project.title} repository`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-medium">
                    Academic Lab
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                {project.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60"
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
