"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Code2, Network, AudioLines, BrainCircuit, Camera, Coffee, ShoppingBag } from "lucide-react";
import type { Project } from "@/types/portfolio";

const projects: Project[] = [
  {
    title: "Prince E-Commerce",
    category: "Full Stack",
    type: "Full Stack Web App",
    description:
      "Full-stack e-commerce platform built with Laravel 12, Livewire 3, and Filament 5. Features product variant & size stock management, seamless guest-to-user cart merge, Midtrans Snap payment gateway integration, and a complete admin panel for order and inventory management.",
    tags: ["Laravel 12", "Livewire 3", "Filament 5", "MySQL", "Midtrans", "PHP"],
    githubUrl: "https://github.com/rasatshq/prince-ecommerce",
    image: "/prince-ecommerce.png",
    accent: "from-violet-500/10 via-purple-500/[0.03] to-white",
    glow: "hover:border-violet-500/50 hover:shadow-violet-500/10",
  },
  {
    title: "Photobooth Online",
    category: "Frontend",
    type: "4-Shot Photostrip Web App",
    description:
      "A free browser-based photobooth that captures four photos from a phone or laptop camera, lets users choose an aesthetic photostrip frame, then download and share the result without signing in.",
    tags: ["4-Shot Photostrip", "Web Camera", "Frame Selection", "No Login"],
    githubUrl: "https://github.com/rasatshq/photobooth-online",
    image: "/photobooth-online.png",
    imageWidth: 1902,
    imageHeight: 907,
    accent: "from-fuchsia-500/10 via-violet-500/[0.03] to-white",
    glow: "hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/10",
  },
  {
    title: "Aplikasi POS Kasir",
    category: "Frontend",
    type: "Web POS System",
    description:
      "A modern responsive Point of Sale (POS) cashier web application built with clean modular JavaScript, supporting product transaction handling, order calculations, and streamlined checkout.",
    tags: ["JavaScript", "HTML5", "CSS3", "POS System"],
    githubUrl: "https://github.com/rasatshq/Aplikasi-Pos-kasir",
    image: "/aplikasi-pos-kasir.png",
    imageWidth: 1887,
    imageHeight: 897,
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
    image: "/cafe-manjaro.png",
    imageWidth: 1899,
    imageHeight: 901,
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
    title: "Judol Sentinel",
    category: "Data Science",
    type: "NLP / Deep Learning",
    description:
      "Deep Learning text classification system using Bidirectional LSTM to detect Indonesian online gambling (judol) promotions. Features a de-obfuscation pipeline to handle intentionally mangled text, trained on a real Indonesian dataset, and deployed as a Cyber SOC monitoring dashboard with Streamlit.",
    tags: ["Python", "BiLSTM", "Keras", "Streamlit", "NLP", "Deep Learning"],
    githubUrl: "https://github.com/rasatshq/indonesian-judol-bilstm",
    accent: "from-rose-500/10 via-red-500/[0.03] to-white",
    glow: "hover:border-rose-500/50 hover:shadow-rose-500/10",
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
  const [activeTab, setActiveTab] = useState("All");
  const filtered = activeTab === "All" ? projects : projects.filter(p => p.category === activeTab);
  const icons = [ShoppingBag, Camera, ShoppingBag, Coffee, AudioLines, Network, BrainCircuit, Code2];
  return (
    <section id="projects" className="section-spacing projects-section">
      <div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2 className="section-title">Ideas, brought <em>to life.</em></h2></div><p>A selection of things I’ve built,<br />explored, and learned along the way.</p></div>
      <div className="project-filters" aria-label="Filter projects">{["All", "Full Stack", "Frontend", "Networking", "Data Science"].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} aria-pressed={activeTab === tab} className={activeTab === tab ? "active" : ""}>{tab}</button>)}</div>
      <div className="project-grid" aria-live="polite">
        {filtered.map(project => {
          const index = projects.indexOf(project);
          const Icon = icons[index];
          const isLatest = project.title === "Photobooth Online";
          return <article key={project.title} className={`project-card ${project.image || isLatest ? "featured-project" : ""}`}>
            <div className={`project-art project-art-${index}`}>
              {project.image ? <><Image src={project.image} alt={`${project.title} screenshot`} width={project.imageWidth ?? 1440} height={project.imageHeight ?? 900} sizes="(max-width: 760px) 100vw, 1100px" className="project-screenshot" />{isLatest && <span className="project-preview-badge">New project / 2026</span>}</> : <><span className="art-category">{project.type}</span><Icon size={64} strokeWidth={1} /><span className="art-title">{project.title}</span><span className="art-number">0{index + 1}</span></>}
            </div>
            <div className="project-details"><div><p className="eyebrow">{project.category}{isLatest ? " / NEW PROJECT" : project.image ? " / FEATURED PROJECT" : ""}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-link" aria-label={`View ${project.title} repository`}><ArrowUpRight size={22} /></a> : <span className="private-project">Personal exploration</span>}</div>
          </article>;
        })}
      </div>
    </section>
  );
}
