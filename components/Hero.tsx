"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, MapPin, FileText, Mail, Copy, Check, Monitor } from "lucide-react";
import { GithubIcon } from "./Icons";

export function Hero() {
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
    <section className="space-y-12">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-14">
        {/* Intro Details */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-50 text-cyan-800 text-xs font-mono tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            Informatics Student &bull; AI-Powered Creator
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.05]">
            Rashad Shaquille <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600">
              Taofik.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Informatics Engineering student at{" "}
            <strong className="text-slate-900 font-semibold">
              Universitas Komputer Indonesia (UNIKOM)
            </strong>
            . Integrating software logic, data-driven solutions, and network
            infrastructure with an AI-first workflow.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono text-slate-600">
            <MapPin className="w-4 h-4 text-cyan-600" />
            <span>Bandung, West Java</span>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
            <a
              href="/cv-rashad-shaquille-taofik.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs tracking-wider uppercase transition-all transform hover:-translate-y-0.5 shadow-lg shadow-cyan-500/25 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <FileText className="w-4 h-4" />
              Download CV
            </a>
            <a
              href="mailto:rashadshaq17@gmail.com"
              className="px-5 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs tracking-wider uppercase transition-all transform hover:-translate-y-0.5 flex items-center gap-2 shadow-sm hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <Mail className="w-4 h-4" />
              Contact
            </a>
            <button
              type="button"
              onClick={copyEmailToClipboard}
              className="px-5 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs tracking-wider uppercase transition-all transform hover:-translate-y-0.5 flex items-center gap-2 shadow-sm hover:border-slate-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label="Copy email address"
            >
              {emailCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
            <a
              href="https://github.com/rasatshq"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs tracking-wider uppercase transition-all transform hover:-translate-y-0.5 flex items-center gap-2 shadow-sm hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <GithubIcon className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        {/* Glowing Photo Card */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-1.5 rounded-[36px] bg-gradient-to-tr from-cyan-400 via-indigo-400 to-emerald-400 opacity-40 blur-xl group-hover:opacity-70 transition duration-700" />

          <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-[32px] overflow-hidden border border-slate-200/80 bg-white shadow-2xl p-2 transition-transform duration-500 group-hover:scale-[1.02]">
            <div className="relative w-full h-full rounded-[24px] overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Rashad Shaquille Taofik"
                fill
                sizes="(max-width: 768px) 208px, (max-width: 1200px) 256px, 288px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Console */}
      <div className="rounded-3xl border border-slate-200/80 bg-slate-900 text-slate-100 backdrop-blur-xl p-5 sm:p-6 shadow-2xl shadow-slate-300/40 font-mono text-xs overflow-hidden relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[11px] text-slate-300">
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
            <span className="text-emerald-400">
              &quot;Rashad Shaquille Taofik&quot;
            </span>
            ,
          </p>
          <p className="pl-5">
            university:{" "}
            <span className="text-emerald-400">
              &quot;Universitas Komputer Indonesia (UNIKOM)&quot;
            </span>
            ,
          </p>
          <p className="pl-5">
            interests: [
            <span className="text-amber-300">&quot;Data Science&quot;</span>,{" "}
            <span className="text-amber-300">&quot;Web Dev&quot;</span>,{" "}
            <span className="text-amber-300">&quot;Cisco Networking&quot;</span>,{" "}
            <span className="text-amber-300">&quot;Generative AI&quot;</span>
            ],
          </p>
          <p className="pl-5">
            currentStatus:{" "}
            <span className="text-emerald-400">
              &quot;Ready for innovation, collaboration &amp; projects&quot;
            </span>
          </p>
          <p>&#125;;</p>
        </div>
      </div>
    </section>
  );
}
