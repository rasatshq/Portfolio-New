import React from "react";
import { Globe, Languages as LanguagesIcon } from "lucide-react";

const languagesList = [
  "Indonesian (Native)",
  "Arabic (Intermediate/Mid-Level)",
  "English (Basic)",
];

export function Languages() {
  return (
    <section id="languages" className="space-y-4 scroll-mt-28">
      <h2 className="flex items-center gap-2 text-xs font-mono text-cyan-600 tracking-widest uppercase font-semibold">
        <Globe className="w-4 h-4" />
        06. Language Proficiency
      </h2>

      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/40 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100">
            <LanguagesIcon className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Languages
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {languagesList.map((lang) => (
            <div
              key={lang}
              className="px-5 py-2.5 rounded-full border border-cyan-200 bg-cyan-50 hover:border-cyan-300 hover:bg-cyan-100/70 text-cyan-900 text-xs sm:text-sm font-medium tracking-wide transition-all shadow-sm"
            >
              {lang}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
