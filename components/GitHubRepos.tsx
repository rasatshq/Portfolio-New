import React from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { getGithubRepos } from "@/lib/github";
import { PROFILE } from "@/constants/profile";

export async function GitHubRepos() {
  const repos = await getGithubRepos();

  return (
    <section id="github" className="section-spacing github-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">05 / OPEN SOURCE &amp; ACTIVITY</p>
          <h2 className="section-title">Public GitHub <em>pulse.</em></h2>
        </div>
        <a
          className="button-text"
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
        >
          github.com/rasatshq <ArrowUpRight size={17} />
        </a>
      </div>

      {repos.length === 0 ? (
        <div className="p-10 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] text-center text-xs text-[var(--muted)] shadow-sm">
          No public repositories found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] shadow-[var(--glass-shadow)] hover:shadow-lg hover:border-white hover:-translate-y-1 transition-all duration-300 group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)]"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--teal)] transition-colors truncate">
                  {repo.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--muted)] font-mono shrink-0 ml-2">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{" "}
                  {repo.stargazers_count}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] line-clamp-2 mb-4 leading-relaxed font-normal">
                {repo.description || "Public repository with no description provided."}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)] pt-3 border-t border-[var(--line)]">
                <span className="text-[var(--teal)] font-medium">
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
