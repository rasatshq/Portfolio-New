import React from "react";

import type { TechSkill } from "@/types/portfolio";

const techStack: TechSkill[] = [
  {
    name: "Next.js / React",
    category: "Web Architecture",
    desc: "Modern SSR, App Router & UI",
  },
  {
    name: "TypeScript",
    category: "Type Safety",
    desc: "Robust full-stack typing",
  },
  {
    name: "Tailwind CSS",
    category: "Design System",
    desc: "Responsive & utility-first UI",
  },
  {
    name: "Python",
    category: "Data & Core",
    desc: "Data analysis & scripting",
  },
  {
    name: "Keras / TensorFlow",
    category: "Deep Learning",
    desc: "BiLSTM & NLP models",
  },
  {
    name: "PHP",
    category: "Backend Architecture",
    desc: "Server-side web apps",
  },
  {
    name: "Laravel",
    category: "Full Stack Framework",
    desc: "MVC, Livewire & Filament",
  },
  {
    name: "JavaScript",
    category: "Frontend Interactive",
    desc: "Modern UI mechanics",
  },
  {
    name: "HTML5 / CSS3",
    category: "Visual Structure",
    desc: "Responsive layout design",
  },
  {
    name: "MySQL",
    category: "Database Engineering",
    desc: "Relational data querying",
  },
  {
    name: "Cisco Packet Tracer",
    category: "Network Topology",
    desc: "VLSM & device security",
  },
  {
    name: "Git & GitHub",
    category: "Version Control",
    desc: "Workflow & collaboration",
  },
  {
    name: "Gemini / ChatGPT",
    category: "AI Tooling",
    desc: "Prompt eng & API integration",
  },
];

const groups = [
  {
    title: "Web & software",
    names: [
      "Next.js / React",
      "TypeScript",
      "Tailwind CSS",
      "PHP",
      "Laravel",
      "JavaScript",
      "HTML5 / CSS3",
      "MySQL",
    ],
  },
  {
    title: "Data & intelligence",
    names: ["Python", "Keras / TensorFlow", "Gemini / ChatGPT"],
  },
  {
    title: "Infrastructure & workflow",
    names: ["Cisco Packet Tracer", "Git & GitHub"],
  },
];
export function TechStack() {
  return (
    <section id="skills" className="section-spacing">
      <div className="section-heading">
        <div>
          <p className="eyebrow">04 / MY TOOLKIT</p>
          <h2 className="section-title">The tools behind <em>the ideas.</em></h2>
        </div>
      </div>
      <div className="skill-groups">
        {groups.map((group, index) => (
          <div className="skill-group" key={group.title}>
            <span className="eyebrow">0{index + 1}</span>
            <h3>{group.title}</h3>
            {techStack
              .filter((tech) => group.names.includes(tech.name))
              .map((tech) => (
                <div key={tech.name} className="skill-row">
                  <strong>{tech.name}</strong>
                  <span>{tech.desc}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
