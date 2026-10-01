import fs from "fs/promises";
import path from "path";
import type { Project } from "@/types/portfolio";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");

import { DEFAULT_PROJECTS } from "@/constants/projects";
export { DEFAULT_PROJECTS };

/**
 * Reads projects from data/projects.json.
 * If file does not exist, it initializes with DEFAULT_PROJECTS.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const content = await fs.readFile(PROJECTS_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed as Project[];
    }
    return DEFAULT_PROJECTS;
  } catch {
    // If file doesn't exist, create it with defaults
    try {
      await saveProjects(DEFAULT_PROJECTS);
    } catch {
      // ignore write error in read-only environments
    }
    return DEFAULT_PROJECTS;
  }
}

/**
 * Writes projects array to data/projects.json.
 */
export async function saveProjects(projects: Project[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

/**
 * Creates a slug from a title string.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * Creates a new project and appends it to the list.
 */
export async function createProject(
  projectData: Omit<Project, "id"> & { id?: string }
): Promise<Project> {
  const projects = await getProjects();
  const baseId = projectData.id?.trim() || slugify(projectData.title) || `proj-${Date.now()}`;

  // Ensure unique ID
  let uniqueId = baseId;
  let counter = 1;
  while (projects.some((p) => p.id === uniqueId)) {
    uniqueId = `${baseId}-${counter++}`;
  }

  const newProject: Project = {
    ...projectData,
    id: uniqueId,
  };

  const updatedList = [newProject, ...projects];
  await saveProjects(updatedList);
  return newProject;
}

/**
 * Updates an existing project by ID.
 */
export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, "id">>
): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProject: Project = {
    ...projects[index],
    ...updates,
    id, // protect id from being overwritten
  };

  projects[index] = updatedProject;
  await saveProjects(projects);
  return updatedProject;
}

/**
 * Deletes a project by ID.
 */
export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;

  await saveProjects(filtered);
  return true;
}

/**
 * Reorders projects given an array of IDs.
 */
export async function reorderProjects(orderedIds: string[]): Promise<Project[]> {
  const projects = await getProjects();
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const reordered: Project[] = [];
  for (const id of orderedIds) {
    const item = projectMap.get(id);
    if (item) {
      reordered.push(item);
      projectMap.delete(id);
    }
  }

  // append any remaining projects that were not in orderedIds
  for (const remaining of projectMap.values()) {
    reordered.push(remaining);
  }

  await saveProjects(reordered);
  return reordered;
}
