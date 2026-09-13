"use client";

import React, { useState, useEffect } from "react";
import { FileText, Menu, X, ChevronRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function closeMenuWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }

    window.addEventListener("keydown", closeMenuWithEscape);
    return () => window.removeEventListener("keydown", closeMenuWithEscape);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "GitHub", href: "#github" },
    { label: "Languages", href: "#languages" },
  ];

  return (
    <header className="fixed top-5 inset-x-0 z-50 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between px-5 py-2.5 rounded-full border border-slate-200/80 bg-white/85 backdrop-blur-2xl shadow-lg shadow-slate-200/40">
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-cyan-600 transition-colors relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Mobile menu button when navigation links are hidden */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href="/cv-rashad-shaquille-taofik.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-cyan-50 hover:bg-cyan-500 text-cyan-700 hover:text-white border border-cyan-200 hover:border-cyan-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label="View Resume / CV (PDF)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>
          <a
            href="https://github.com/rasatshq"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/rashad-shaquille-taofik"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="md:hidden mt-3 p-5 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-xl flex flex-col gap-3 animate-menu-in"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-mono tracking-wider text-slate-700 hover:text-cyan-600 transition-colors py-2 border-b border-slate-100 flex items-center justify-between"
            >
              <span>{link.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          ))}
          <div className="flex gap-2 pt-1">
            <a
              href="/cv-rashad-shaquille-taofik.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold text-xs font-mono transition flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Resume
            </a>
            <a
              href="mailto:rashadshaq17@gmail.com"
              className="flex-1 text-center py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs font-mono transition"
            >
              Message
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
