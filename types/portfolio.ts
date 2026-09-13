export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export interface Project {
  title: string;
  category: string;
  type: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  accent: string;
  glow: string;
}

export interface ExperienceItem {
  type: string;
  institution: string;
  role: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
  accent: string;
  badgeColor: string;
}

export interface TechSkill {
  name: string;
  category: string;
  desc: string;
}
