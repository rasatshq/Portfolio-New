import React from "react";
import { PROFILE } from "@/constants/profile";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)] py-10 px-6 max-w-[1160px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
      <p>
        &copy; {currentYear} {PROFILE.name}. Built with Next.js &amp; Tailwind CSS.
      </p>
      <div className="flex items-center gap-6">
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--foreground)] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--teal)] rounded"
        >
          GitHub
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--foreground)] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--teal)] rounded"
        >
          LinkedIn
        </a>
        <a
          href={`mailto:${PROFILE.email}`}
          className="hover:text-[var(--foreground)] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--teal)] rounded"
        >
          Email
        </a>
      </div>
    </footer>
  );
}

