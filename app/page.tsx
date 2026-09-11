"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Mail,
  ExternalLink,
  Terminal as TerminalIcon,
  Code2,
  Cpu,
  Sparkles,
  ArrowUpRight,
  GitBranch,
  Star,
  Layers,
  GraduationCap,
  Briefcase,
  Menu,
  X,
  MapPin,
  ChevronRight,
  Monitor,
  Globe,
  Languages as LanguagesIcon,
} from "lucide-react";

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export default function Portfolio() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("All");

  useEffect(() => {
    async function fetchGitHubRepos() {
      try {
        const res = await fetch(
          "https://api.github.com/users/rasatshq/repos?sort=updated&per_page=4",
        );
        if (res.ok) {
          const data: Repository[] = await res.json();
          setRepos(data);
        }
      } catch (err) {
        console.error("Failed to fetch GitHub repositories:", err);
      } finally {
        setLoadingRepos(false);
      }
    }
    fetchGitHubRepos();
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "GitHub", href: "#github" },
    { label: "Languages", href: "#languages" },
  ];

  const techStack = [
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

  const projects = [
    {
      title: "Cafe Manjaro Web Interface",
      category: "Frontend",
      type: "Interactive POS & UI",
      description:
        "A responsive cashier system and cafe landing page focused on intuitive order workflows and a sleek modern dark interface.",
      tags: ["HTML5", "CSS3", "JavaScript"],
      githubUrl: "https://github.com/rasatshq",
      accent: "from-cyan-500/20 via-blue-500/5 to-transparent",
      glow: "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
    },
    {
      title: "Network Architecture & Security Lab",
      category: "Networking",
      type: "Infrastructure",
      description:
        "Medium-scale network topology design in Cisco Packet Tracer incorporating Variable Length Subnet Masking (VLSM) and switch port security protocols.",
      tags: ["Cisco Packet Tracer", "VLSM", "Security"],
      githubUrl: "https://github.com/rasatshq",
      accent: "from-emerald-500/20 via-teal-500/5 to-transparent",
      glow: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    },
    {
      title: "Data Science & Processing Lab",
      category: "Data Science",
      type: "Data Pipeline",
      description:
        "Raw dataset cleaning (data scrubbing), missing/anomaly value handling, and exploratory data analysis using Python and the NumPy ecosystem.",
      tags: ["Python", "NumPy", "Data Scrubbing"],
      githubUrl: "https://github.com/rasatshq",
      accent: "from-indigo-500/20 via-purple-500/5 to-transparent",
      glow: "hover:border-indigo-500/40 hover:shadow-indigo-500/10",
    },
  ];

  const languagesList = [
    "Indonesian (Native)",
    "Arabic (Intermediate/Mid-Level)",
    "English (Basic)",
  ];

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 antialiased selection:bg-cyan-400 selection:text-black relative overflow-x-hidden">
      {/* Background Dot Grid & Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-cyan-500/20 via-indigo-500/10 to-transparent blur-[160px] rounded-full" />
        <div className="absolute top-[45%] -right-48 w-[600px] h-[600px] bg-indigo-600/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-10 -left-48 w-[500px] h-[500px] bg-cyan-600/10 blur-[180px] rounded-full" />
      </div>

      {/* Floating Pill Navigation */}
      <header className="fixed top-5 inset-x-0 z-50 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between px-5 py-3 rounded-full border border-white/10 bg-[#070b14]/85 backdrop-blur-2xl shadow-2xl shadow-black/80">
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-white group-hover:text-cyan-400 transition-colors">
              rashad.io
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-xs font-mono uppercase tracking-widest text-slate-400">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-cyan-400 transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/rasatshq"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/rashad-shaquille-taofik"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/10 text-slate-300 transition ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-5 rounded-3xl border border-white/10 bg-[#070b14]/95 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono tracking-wider text-slate-300 hover:text-cyan-400 transition-colors py-2 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}
            <a
              href="mailto:rashadshaq17@gmail.com"
              className="mt-2 text-center py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono transition"
            >
              Send Message
            </a>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-28 space-y-32">
        {/* Hero Section */}
        <section className="space-y-12">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-14">
            {/* Intro Details */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Informatics Student &bull; AI-Powered Creator
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                Rashad Shaquille <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                  Taofik.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Informatics Engineering student at{" "}
                <strong className="text-slate-100 font-semibold">
                  Universitas Komputer Indonesia (UNIKOM)
                </strong>
                . Integrating software logic, data-driven solutions, and network
                infrastructure with an AI-first workflow.
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Bandung, West Java / Cibitung, Bekasi</span>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-3">
                <a
                  href="mailto:rashadshaq17@gmail.com"
                  className="px-7 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs tracking-wider uppercase transition-all transform hover:-translate-y-0.5 shadow-lg shadow-cyan-500/25"
                >
                  Contact Me
                </a>
                <a
                  href="https://github.com/rasatshq"
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wider uppercase transition-all transform hover:-translate-y-0.5 flex items-center gap-2 backdrop-blur-md"
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub Profile
                </a>
              </div>
            </div>

            {/* Glowing Photo Card */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1.5 rounded-[36px] bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 opacity-60 blur-xl group-hover:opacity-90 transition duration-700" />

              <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-[32px] overflow-hidden border border-white/20 bg-[#0d1322] shadow-2xl p-2 transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="relative w-full h-full rounded-[24px] overflow-hidden">
                  <Image
                    src="/profile.jpg"
                    alt="Rashad Shaquille Taofik"
                    fill
                    sizes="(max-width: 768px) 208px, (max-width: 1200px) 256px, 288px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-transparent to-transparent opacity-60" />
                </div>

                <div className="absolute bottom-4 inset-x-4 py-2 px-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300">Rashad S. T.</span>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Console */}
          <div className="rounded-3xl border border-white/10 bg-[#070b14]/70 backdrop-blur-xl p-5 sm:p-6 shadow-2xl font-mono text-xs overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-[11px] text-slate-400">
                  bash - profile.sh
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400/90">
                <Monitor className="w-3.5 h-3.5" />
                <span>UNIKOM Campus Node</span>
              </div>
            </div>

            <div className="pt-4 space-y-2 text-slate-300 leading-relaxed overflow-x-auto">
              <p className="text-slate-500"># Developer system configuration</p>
              <p>
                <span className="text-cyan-400">const</span>{" "}
                <span className="text-indigo-300">developer</span> = &#123;
              </p>
              <p className="pl-5">
                name:{" "}
                <span className="text-emerald-300">
                  &quot;Rashad Shaquille Taofik&quot;
                </span>
                ,
              </p>
              <p className="pl-5">
                university:{" "}
                <span className="text-emerald-300">
                  &quot;Universitas Komputer Indonesia (UNIKOM)&quot;
                </span>
                ,
              </p>
              <p className="pl-5">
                interests: [
                <span className="text-amber-300">&quot;Data Science&quot;</span>
                , <span className="text-amber-300">&quot;Web Dev&quot;</span>,{" "}
                <span className="text-amber-300">
                  &quot;Cisco Networking&quot;
                </span>
                ,{" "}
                <span className="text-amber-300">
                  &quot;Generative AI&quot;
                </span>
                ],
              </p>
              <p className="pl-5">
                currentStatus:{" "}
                <span className="text-emerald-300">
                  &quot;Ready for innovation, collaboration &amp; projects&quot;
                </span>
              </p>
              <p>&#125;;</p>
            </div>
          </div>
        </section>

        {/* Section 01: About Me (3 Kolom Kontak Bersih Tanpa No WhatsApp) */}
        <section id="about" className="space-y-6 scroll-mt-28">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase">
            <TerminalIcon className="w-4 h-4" />
            01. About Me
          </div>

          <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#0a1120]/80 backdrop-blur-xl shadow-2xl space-y-10">
            <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed text-center sm:text-left max-w-4xl mx-auto">
              <p>
                I am a dedicated{" "}
                <strong className="text-white font-semibold">
                  Informatics Engineering student
                </strong>{" "}
                with a focus on Data Science, Web Development, and Network
                Configuration. I am an AI enthusiast who actively integrates
                Artificial Intelligence tools to optimize daily productivity and
                problem-solving.
              </p>
              <p>
                Experienced in education through a one-year teaching service,
                which helped me develop strong communication and leadership
                skills. My goal is to continually build a foundation in software
                logic and data-driven solutions while contributing to the tech
                ecosystem.
              </p>
            </div>

            {/* 3 Kolom Info Kontak Tanpa WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-center">
              <div className="space-y-2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-400 font-light">
                  Location
                </span>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Bandung, West Java
                </p>
              </div>

              <div className="space-y-2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-400 font-light">Email</span>
                <p className="text-xs sm:text-sm font-semibold text-white break-all">
                  rashadshaq17@gmail.com
                </p>
              </div>

              <div className="space-y-2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-400 font-light">
                  Language
                </span>
                <p className="text-xs sm:text-sm font-semibold text-white font-mono tracking-wide">
                  ID, AR, EN
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Tech Stack & Arsenal */}
        <section id="skills" className="space-y-6 scroll-mt-28">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase">
            <Layers className="w-4 h-4" />
            02. Tech Arsenal &amp; Skills
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="p-5 rounded-2xl border border-white/5 bg-[#080d18]/50 hover:bg-[#0c1426] hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {tech.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                      {tech.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-light">
                    {tech.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 03: Projects Showcase */}
        <section id="projects" className="space-y-6 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase">
              <Cpu className="w-4 h-4" />
              03. Featured Projects
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
              {["All", "Frontend", "Networking", "Data Science"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-full transition-all ${
                    activeTab === tab
                      ? "bg-cyan-400 text-black font-semibold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredProjects.map((project, idx) => (
              <div
                key={idx}
                className={`group p-6 sm:p-7 rounded-3xl border border-white/10 bg-gradient-to-b ${project.accent} backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${project.glow} flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {project.type}
                    </span>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-white/20 text-slate-300 hover:text-white transition"
                      aria-label="View project repository"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 04: GitHub Live Monitor */}
        <section id="github" className="space-y-5 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase">
              <GitBranch className="w-4 h-4" />
              04. Public GitHub Progress
            </div>
            <a
              href="https://github.com/rasatshq"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              github.com/rasatshq <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {loadingRepos ? (
            <div className="p-10 rounded-3xl border border-white/5 bg-white/[0.02] text-center text-xs font-mono text-slate-500">
              Loading live repositories from GitHub API...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-6 rounded-3xl border border-white/5 bg-[#070b14]/50 hover:bg-[#0b1222] hover:border-cyan-500/40 transition-all duration-300 group block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {repo.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-mono shrink-0">
                      <Star className="w-3 h-3 text-amber-400" />{" "}
                      {repo.stargazers_count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 font-light">
                    {repo.description ||
                      "Public repository with no description provided."}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="text-cyan-400/80">
                      {repo.language || "Code Base"}
                    </span>
                    <span>
                      Updated{" "}
                      {new Date(repo.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Section 05: Languages */}
        <section id="languages" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase">
            <Globe className="w-4 h-4" />
            05. Language Proficiency
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0a1120]/80 backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <LanguagesIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Languages
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {languagesList.map((lang) => (
                <div
                  key={lang}
                  className="px-5 py-2.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 hover:border-cyan-400/60 hover:bg-cyan-900/40 text-slate-200 text-xs sm:text-sm font-medium tracking-wide transition-all shadow-sm"
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <p>
          &copy; {currentYear} Rashad Shaquille Taofik. Built with Next.js &amp;
          Tailwind CSS.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/rasatshq"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-200 transition"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/rashad-shaquille-taofik"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-200 transition"
          >
            LinkedIn
          </a>
          <a
            href="mailto:rashadshaq17@gmail.com"
            className="hover:text-slate-200 transition"
          >
            Email
          </a>
        </div>
      </footer>
    </div>
  );
}
