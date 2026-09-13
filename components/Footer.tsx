import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 py-10 px-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
      <p>
        &copy; {currentYear} Rashad Shaquille Taofik. Built with Next.js &amp;
        Tailwind CSS.
      </p>
      <div className="flex items-center gap-6">
        <a
          href="https://github.com/rasatshq"
          target="_blank"
          rel="noreferrer"
          className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/rashad-shaquille-taofik"
          target="_blank"
          rel="noreferrer"
          className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded"
        >
          LinkedIn
        </a>
        <a
          href="mailto:rashadshaq17@gmail.com"
          className="hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded"
        >
          Email
        </a>
      </div>
    </footer>
  );
}
