import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "@/lib/projects";
import type { Project } from "@/types/portfolio";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Omit<Project, "id">;
    if (!body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json(
        { error: "Title dan Description wajib diisi." },
        { status: 400 }
      );
    }

    const created = await createProject({
      title: body.title.trim(),
      category: body.category?.trim() || "Frontend",
      type: body.type?.trim() || "Web App",
      description: body.description.trim(),
      tags: Array.isArray(body.tags) ? body.tags : [],
      githubUrl: body.githubUrl?.trim() || undefined,
      demoUrl: body.demoUrl?.trim() || undefined,
      image: body.image?.trim() || undefined,
      imageWidth: body.imageWidth ? Number(body.imageWidth) : undefined,
      imageHeight: body.imageHeight ? Number(body.imageHeight) : undefined,
      accent: body.accent || "from-cyan-500/10 via-teal-500/[0.03] to-white",
      glow: body.glow || "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    });

    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal membuat project." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<Project> & { id: string };
    if (!body.id) {
      return NextResponse.json(
        { error: "ID project wajib disertakan." },
        { status: 400 }
      );
    }

    const updated = await updateProject(body.id, {
      title: body.title?.trim(),
      category: body.category?.trim(),
      type: body.type?.trim(),
      description: body.description?.trim(),
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      githubUrl: body.githubUrl !== undefined ? body.githubUrl.trim() || undefined : undefined,
      demoUrl: body.demoUrl !== undefined ? body.demoUrl.trim() || undefined : undefined,
      image: body.image !== undefined ? body.image.trim() || undefined : undefined,
      imageWidth: body.imageWidth ? Number(body.imageWidth) : undefined,
      imageHeight: body.imageHeight ? Number(body.imageHeight) : undefined,
      accent: body.accent,
      glow: body.glow,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Project dengan ID tersebut tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal memperbarui project." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter ID wajib disertakan." },
        { status: 400 }
      );
    }

    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Project tidak ditemukan atau sudah dihapus." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Project berhasil dihapus." });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal menghapus project." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds harus berupa array string." },
        { status: 400 }
      );
    }

    const reordered = await reorderProjects(orderedIds);
    return NextResponse.json({ success: true, projects: reordered });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Gagal mengurutkan project." },
      { status: 500 }
    );
  }
}
