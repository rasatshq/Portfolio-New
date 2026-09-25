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
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
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

export interface SkillItem {
  id: string;
  name: string;
  desc: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: SkillItem[];
}

export interface ProfileData {
  name: string;
  avatarUrl: string;
  caption: string;
  note: string;
  email: string;
  location: string;
  university: string;
  cvUrl: string;
  github: string;
  linkedin: string;
}
