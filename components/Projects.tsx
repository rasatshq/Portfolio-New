"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Code2,
  Network,
  AudioLines,
  BrainCircuit,
  Camera,
  Coffee,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import type { Project } from "@/types/portfolio";
import { DEFAULT_PROJECTS } from "@/constants/projects";

const icons = [
  ShoppingBag,
  Camera,
  ShoppingBag,
  Coffee,
  AudioLines,
  Network,
  BrainCircuit,
  Code2,
];

export function Projects({ initialProjects }: { initialProjects?: Project[] }) {
  const [activeTab, setActiveTab] = useState("All");
  const projects =
    initialProjects && initialProjects.length > 0
      ? initialProjects
      : DEFAULT_PROJECTS;

  const filtered =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <section id="projects" className="section-spacing projects-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / SELECTED WORK</p>
          <h2 className="section-title">
            Ideas, brought <em>to life.</em>
          </h2>
        </div>
        <p>
          A selection of things I’ve built,
          <br />
          explored, and learned along the way.
        </p>
      </div>
      <div className="project-filters" aria-label="Filter projects">
        {["All", "Full Stack", "Frontend", "Networking", "Data Science"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={activeTab === tab ? "active" : ""}
            >
              {tab}
            </button>
          )
        )}
      </div>
      <div className="project-grid" aria-live="polite">
        {filtered.map((project) => {
          const index = projects.indexOf(project);
          const Icon = icons[index % icons.length] || Code2;
          const isLatest = project.title === "Photobooth Online";
          return (
            <article
              key={project.id || project.title}
              className={`project-card ${
                project.image || isLatest ? "featured-project" : ""
              }`}
            >
              <div className={`project-art project-art-${index % 8}`}>
                {project.image ? (
                  <>
                    <Image
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      width={project.imageWidth ?? 1440}
                      height={project.imageHeight ?? 900}
                      sizes="(max-width: 760px) 100vw, 1100px"
                      className="project-screenshot"
                    />
                    {isLatest && (
                      <span className="project-preview-badge">
                        New project / 2026
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="art-category">{project.type}</span>
                    <Icon size={64} strokeWidth={1} />
                    <span className="art-title">{project.title}</span>
                    <span className="art-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </>
                )}
              </div>
              <div className="project-details">
                <div>
                  <p className="eyebrow">
                    {project.category}
                    {isLatest
                      ? " / NEW PROJECT"
                      : project.image
                      ? " / FEATURED PROJECT"
                      : ""}
                  </p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link"
                      aria-label={`View live demo of ${project.title}`}
                      title="Live Demo"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link"
                      aria-label={`View ${project.title} repository`}
                      title="GitHub Repository"
                    >
                      <ArrowUpRight size={22} />
                    </a>
                  ) : !project.demoUrl ? (
                    <span className="private-project">Personal exploration</span>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
