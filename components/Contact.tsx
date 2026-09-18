import React from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { PROFILE } from "@/constants/profile";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-28">
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-200/80 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 p-8 shadow-xl shadow-cyan-100/50 sm:p-12">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl space-y-4">
            <p className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-cyan-700">
              <MessageCircle className="h-4 w-4" />
              07. Let&apos;s connect
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Have a project, idea, or problem to solve?
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              I&apos;m open to thoughtful collaborations, student projects, and
              opportunities to build practical products with software, data, and
              AI.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5 hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <Mail className="h-4 w-4" />
              Start a conversation
            </a>
            <div className="flex items-center justify-center gap-2">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <LinkedinIcon className="h-4 w-4" />
                LinkedIn
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
