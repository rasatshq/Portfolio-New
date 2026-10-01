import { ArrowUpRight } from "lucide-react";
import { getGithubRepos } from "@/lib/github";

export async function GitHubRepos({ githubUrl }: { githubUrl: string }) {
  const repos = await getGithubRepos();
  return (
    <section id="github" className="section-spacing github-section" aria-labelledby="github-title">
      <div className="section-heading"><div><p className="eyebrow">05 / On GitHub</p><h2 id="github-title" className="section-title">The work continues.</h2></div>{githubUrl && <a className="button-text" href={githubUrl} target="_blank" rel="noopener noreferrer">View GitHub <ArrowUpRight size={17} aria-hidden="true" /></a>}</div>
      {repos.length === 0 ? <p className="empty-state">No repository data is available right now. You can check GitHub directly using the link above.</p> : <div className="repo-list">{repos.map(repo => <a className="repo-row" key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer">
        <div><h3>{repo.name}<ArrowUpRight size={18} aria-hidden="true" /></h3><p>{repo.description || "No description provided."}</p></div>
        <div className="repo-meta"><span>{repo.language || "Language not listed"}</span><span>{repo.stargazers_count} {repo.stargazers_count === 1 ? "star" : "stars"}</span><time dateTime={repo.updated_at}>Updated {new Date(repo.updated_at).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}</time></div>
      </a>)}</div>}
    </section>
  );
}
