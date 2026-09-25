import type { SkillGroup } from "@/types/portfolio";

export const DEFAULT_SKILL_GROUPS: SkillGroup[] = [
  {
    id: "web-software",
    title: "Web & software",
    skills: [
      {
        id: "nextjs-react",
        name: "Next.js / React",
        desc: "Modern SSR, App Router & UI",
      },
      {
        id: "typescript",
        name: "TypeScript",
        desc: "Robust full-stack typing",
      },
      {
        id: "tailwind-css",
        name: "Tailwind CSS",
        desc: "Responsive & utility-first UI",
      },
      {
        id: "php",
        name: "PHP",
        desc: "Server-side web apps",
      },
      {
        id: "laravel",
        name: "Laravel",
        desc: "MVC, Livewire & Filament",
      },
      {
        id: "javascript",
        name: "JavaScript",
        desc: "Modern UI mechanics",
      },
      {
        id: "html5-css3",
        name: "HTML5 / CSS3",
        desc: "Responsive layout design",
      },
      {
        id: "mysql",
        name: "MySQL",
        desc: "Relational data querying",
      },
    ],
  },
  {
    id: "data-intelligence",
    title: "Data & intelligence",
    skills: [
      {
        id: "python",
        name: "Python",
        desc: "Data analysis & scripting",
      },
      {
        id: "keras-tensorflow",
        name: "Keras / TensorFlow",
        desc: "BiLSTM & NLP models",
      },
      {
        id: "gemini-chatgpt",
        name: "Gemini / ChatGPT",
        desc: "Prompt eng & API integration",
      },
    ],
  },
  {
    id: "infrastructure-workflow",
    title: "Infrastructure & workflow",
    skills: [
      {
        id: "cisco-packet-tracer",
        name: "Cisco Packet Tracer",
        desc: "VLSM & device security",
      },
      {
        id: "git-github",
        name: "Git & GitHub",
        desc: "Workflow & collaboration",
      },
    ],
  },
];

export function createUniqueSlug(text: string, count: number): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
  return `${base || "item"}-${count}`;
}
