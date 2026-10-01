import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import fs from "fs/promises";
import { Projects } from "@/components/Projects";
import { TechStack } from "@/components/TechStack";
import { DEFAULT_PROJECTS } from "@/constants/projects";
import { getProjects, createProject, deleteProject, updateProject, reorderProjects } from "@/lib/projects";
import { getSkills, saveSkills } from "@/lib/skills";

vi.mock("fs/promises", () => ({ default: { readFile: vi.fn(), writeFile: vi.fn(), mkdir: vi.fn() } }));
vi.mock("next/image", () => ({ default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} /> }));
afterEach(() => { cleanup(); vi.resetAllMocks(); });

describe("CMS content in the redesign", () => {
  it("keeps an empty CMS empty, including after deleting the final project", async () => {
    let stored = "[]";
    vi.mocked(fs.readFile).mockImplementation(async () => stored);
    vi.mocked(fs.writeFile).mockImplementation(async (_path, data) => { stored = String(data); });
    expect(await getProjects()).toEqual([]);
    expect(await getSkills()).toEqual([]);
    const project = await createProject(DEFAULT_PROJECTS[0]);
    expect(await getProjects()).toHaveLength(1);
    await updateProject(project.id, { title: "Updated title" });
    expect((await getProjects())[0].title).toBe("Updated title");
    expect(await reorderProjects([project.id])).toHaveLength(1);
    await deleteProject(project.id);
    expect(await getProjects()).toEqual([]);
    await saveSkills([{ id: "new", title: "New category", skills: [{ id: "docker", name: "Docker", desc: "Containers" }] }]);
    expect((await getSkills())[0].skills[0].name).toBe("Docker");
    await saveSkills([]);
    expect(await getSkills()).toEqual([]);
  });

  it("renders empty states without substituting default content", () => {
    render(<><Projects initialProjects={[]} /><TechStack initialGroups={[]} /></>);
    expect(screen.getByText("No projects to show yet.")).toBeTruthy();
    expect(screen.getByText("No skills listed yet.")).toBeTruthy();
    expect(screen.queryByRole("article")).toBeNull();
  });

  it.each([1, 3, 6, 12])("renders %i CMS projects and filters a new category", count => {
    const projects = Array.from({ length: count }, (_, index) => ({ ...DEFAULT_PROJECTS[0], id: `project-${index}`, title: `Project ${index}`, category: index === 0 ? "New CMS category" : "Other", demoUrl: undefined, githubUrl: undefined }));
    render(<Projects initialProjects={projects} />);
    expect(screen.getAllByRole("article")).toHaveLength(count);
    fireEvent.click(screen.getByRole("button", { name: "New CMS category" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.queryByRole("link")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /All work/ }));
    expect(screen.getAllByRole("article")).toHaveLength(count);
  });

  it.each([5, 10, 20, 36])("renders all %i skills in CMS-defined categories", count => {
    const skills = Array.from({ length: count }, (_, index) => ({ id: `skill-${index}`, name: `Skill ${index}`, desc: "From the CMS" }));
    render(<TechStack initialGroups={[{ id: "custom", title: "Custom category", skills }]} />);
    expect(screen.getAllByRole("term")).toHaveLength(count);
    expect(screen.getByRole("heading", { name: "Custom category" })).toBeTruthy();
  });
});
