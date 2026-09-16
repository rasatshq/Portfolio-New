import React from "react";
import { GitBranch, ExternalLink, Star } from "lucide-react";
import { getGithubRepos } from "@/lib/github";
import { PROFILE } from "@/constants/profile";

export async function GitHubRepos() {
  const repos = await getGithubRepos();

  return (
    <section id="github" className="space-y-5 scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xs font-mono text-cyan-600 tracking-widest uppercase font-semibold">
          <GitBranch className="w-4 h-4" />
          05. Public GitHub Progress
        </h2>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono text-slate-500 hover:text-cyan-600 flex items-center gap-1.5 transition-colors font-medium"
        >
          github.com/rasatshq <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {repos.length === 0 ? (
        <div className="p-10 rounded-3xl border border-slate-200 bg-white/80 text-center text-xs font-mono text-slate-500 shadow-sm">
          No public repositories found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm hover:shadow-md hover:border-cyan-500/50 hover:bg-slate-50/50 transition-all duration-300 group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors truncate">
                  {repo.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-600 font-mono shrink-0">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />{" "}
                  {repo.stargazers_count}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 mb-4 font-normal">
                {repo.description || "Public repository with no description provided."}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="text-cyan-700 font-medium">
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
  );
}
