import React from "react";
import { PROFILE } from "@/constants/profile";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 py-10 px-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
      <p>
        &copy; {currentYear} {PROFILE.name}. Built with Next.js &amp;
        Tailwind CSS.
      </p>
      <div className="flex items-center gap-6">
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded"
        >
          GitHub
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noreferrer"
          className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded"
        >
          LinkedIn
        </a>
        <a
          href={`mailto:${PROFILE.email}`}
          className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded"
        >
          Email
        </a>
      </div>
    </footer>
  );
}

