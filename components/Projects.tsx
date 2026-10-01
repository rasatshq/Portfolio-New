"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/portfolio";

export function Projects({ initialProjects: projects }: { initialProjects: Project[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const categories = [...new Set(projects.map(project => project.category))];
  const filtered = category === null ? projects : projects.filter(project => project.category === category);

  return (
    <section id="projects" className="section-spacing projects-section" aria-labelledby="projects-title">
      <div className="section-heading">
        <div><p className="eyebrow">01 / Selected work</p><h2 id="projects-title" className="section-title">Built to be used.</h2></div>
        <p>Web apps, data experiments,<br />and the details behind them.</p>
      </div>
      {projects.length > 0 && <div className="project-filters" aria-label="Filter projects">
        <button onClick={() => setCategory(null)} aria-pressed={category === null}>All work <span>{projects.length}</span></button>
        {categories.map(item => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
      </div>}
      <div className="project-list" aria-live="polite">
        {filtered.length === 0 && <p className="empty-state">No projects to show{category ? " in this category" : " yet"}.</p>}
        {filtered.map(project => (
          <article key={project.id} className={`project-entry ${project.image ? "has-image" : "text-project"}`}>
            {project.image && <div className="project-art"><Image src={project.image} alt={`${project.title} application screenshot`} width={project.imageWidth ?? 1440} height={project.imageHeight ?? 900} sizes="(max-width: 760px) 100vw, 750px" className="project-screenshot" /></div>}
            <div className="project-details">
              <p className="project-meta"><span>{String(projects.indexOf(project) + 1).padStart(2, "0")}</span>{project.category}</p>
              <h3>{project.title}</h3>
              <p className="project-type">{project.type}</p>
              <p className="project-description">{project.description}</p>
              <ul className="tags" aria-label="Technologies">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
              <div className="project-links">
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title}: GitHub repository`}>GitHub <ArrowUpRight size={16} aria-hidden="true" /></a>}
                {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title}: Live demo`}>Live demo <ArrowUpRight size={16} aria-hidden="true" /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
