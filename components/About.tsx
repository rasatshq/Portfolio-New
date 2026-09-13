"use client";

import React, { useState } from "react";
import { Terminal as TerminalIcon, MapPin, Mail, Globe, Copy, Check } from "lucide-react";

export function About() {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("rashadshaq17@gmail.com");
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <section id="about" className="space-y-6 scroll-mt-28">
      <h2 className="flex items-center gap-2 text-xs font-mono text-cyan-600 tracking-widest uppercase font-semibold">
        <TerminalIcon className="w-4 h-4" />
        01. About Me
      </h2>

      <div className="p-8 sm:p-12 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/40 space-y-10">
        <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed text-center sm:text-left max-w-4xl mx-auto">
          <p>
            I am a dedicated{" "}
            <strong className="text-slate-900 font-semibold">
              Informatics Engineering student
            </strong>{" "}
            with a focus on Data Science, Web Development, and Network Configuration.
            I actively integrate Artificial Intelligence tools into my development
            workflows to maximize productivity, coding speed, and innovative problem-solving.
          </p>
          <p>
            Experienced in education through a one-year teaching service, which built
            strong communication, public presentation, and team leadership skills.
            My goal is to continuously develop scalable software architectures and
            data-driven solutions while contributing actively to the tech ecosystem.
          </p>
        </div>

        {/* 3 Columns Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 text-center">
          <div className="space-y-2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 font-normal">Location</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              Bandung, West Java
            </p>
          </div>

          <button
            type="button"
            onClick={copyEmailToClipboard}
            className="group relative space-y-2 flex flex-col items-center p-2 rounded-2xl transition hover:bg-slate-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label="Copy email address"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-100 group-hover:scale-110 transition">
              {emailCopied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
            </div>
            <span className="text-xs text-slate-500 font-normal flex items-center gap-1">
              Email
              <span className="text-[10px] text-cyan-600 font-mono">
                {emailCopied ? "(Copied!)" : "(Click to copy)"}
              </span>
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 break-all flex items-center gap-1.5 group-hover:text-cyan-600 transition-colors">
              rashadshaq17@gmail.com
              {emailCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 transition shrink-0" />
              )}
            </p>
            {emailCopied && (
              <span className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold shadow-lg">
                Copied!
              </span>
            )}
          </button>

          <div className="space-y-2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 font-normal">Language</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 font-mono tracking-wide">
              ID, AR, EN
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
