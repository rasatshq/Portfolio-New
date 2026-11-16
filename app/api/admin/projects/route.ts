import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "@/lib/projects";
import {
  getStorageErrorMessage,
  normalizeImageInput,
  normalizeLinkUrl,
} from "@/lib/urls";
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
    const body = (await request.json()) as Partial<Project>;
    if (
      typeof body.title !== "string" ||
      !body.title.trim() ||
      typeof body.description !== "string" ||
      !body.description.trim()
    ) {
      return NextResponse.json(
        { error: "Title dan Description wajib diisi." },
        { status: 400 }
      );
    }

    const githubCheck = normalizeLinkUrl(body.githubUrl);
    if (!githubCheck.ok) {
      return NextResponse.json(
        { error: `Link GitHub: ${githubCheck.error}` },
        { status: 400 }
      );
    }

    const demoCheck = normalizeLinkUrl(body.demoUrl);
    if (!demoCheck.ok) {
      return NextResponse.json(
        { error: `Link Live Demo: ${demoCheck.error}` },
        { status: 400 }
      );
    }

    const imageCheck = normalizeImageInput(body.image);
    if (!imageCheck.ok) {
      return NextResponse.json(
        { error: `Gambar Proyek: ${imageCheck.error}` },
        { status: 400 }
      );
    }

    const created = await createProject({
      title: body.title.trim(),
      category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : "Frontend",
      type: typeof body.type === "string" && body.type.trim() ? body.type.trim() : "Web App",
      description: body.description.trim(),
      tags: Array.isArray(body.tags)
        ? body.tags.filter((t): t is string => typeof t === "string" && Boolean(t.trim())).map((t) => t.trim())
        : [],
      githubUrl: githubCheck.value || undefined,
      demoUrl: demoCheck.value || undefined,
      image: imageCheck.value || undefined,
      imageWidth: body.imageWidth ? Number(body.imageWidth) : undefined,
      imageHeight: body.imageHeight ? Number(body.imageHeight) : undefined,
      accent: body.accent || "from-cyan-500/10 via-teal-500/[0.03] to-white",
      glow: body.glow || "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getStorageErrorMessage(error, "Gagal membuat project.") },
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
    const body = (await request.json()) as Partial<Project> & { id?: unknown };
    if (typeof body.id !== "string" || !body.id.trim()) {
      return NextResponse.json(
        { error: "ID project wajib disertakan." },
        { status: 400 }
      );
    }

    const updates: Partial<Omit<Project, "id">> = {};

    if ("title" in body) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return NextResponse.json(
          { error: "Judul proyek wajib diisi." },
          { status: 400 }
        );
      }
      updates.title = body.title.trim();
    }

    if ("description" in body) {
      if (typeof body.description !== "string" || !body.description.trim()) {
        return NextResponse.json(
          { error: "Deskripsi proyek wajib diisi." },
          { status: 400 }
        );
      }
      updates.description = body.description.trim();
    }

    if ("category" in body && typeof body.category === "string") {
      updates.category = body.category.trim() || "General";
    }

    if ("type" in body && typeof body.type === "string") {
      updates.type = body.type.trim() || "Web App";
    }

    if ("tags" in body && Array.isArray(body.tags)) {
      updates.tags = body.tags
        .filter((t): t is string => typeof t === "string" && Boolean(t.trim()))
        .map((t) => t.trim());
    }

    if ("githubUrl" in body) {
      const githubCheck = normalizeLinkUrl(body.githubUrl);
      if (!githubCheck.ok) {
        return NextResponse.json(
          { error: `Link GitHub: ${githubCheck.error}` },
          { status: 400 }
        );
      }
      updates.githubUrl = githubCheck.value || undefined;
    }

    if ("demoUrl" in body) {
      const demoCheck = normalizeLinkUrl(body.demoUrl);
      if (!demoCheck.ok) {
        return NextResponse.json(
          { error: `Link Live Demo: ${demoCheck.error}` },
          { status: 400 }
        );
      }
      updates.demoUrl = demoCheck.value || undefined;
    }

    if ("image" in body) {
      const imageCheck = normalizeImageInput(body.image);
      if (!imageCheck.ok) {
        return NextResponse.json(
          { error: `Gambar Proyek: ${imageCheck.error}` },
          { status: 400 }
        );
      }
      updates.image = imageCheck.value || undefined;
      if (!updates.image) {
        updates.imageWidth = undefined;
        updates.imageHeight = undefined;
      }
    }

    if ("imageWidth" in body) {
      updates.imageWidth = body.imageWidth ? Number(body.imageWidth) : undefined;
    }
    if ("imageHeight" in body) {
      updates.imageHeight = body.imageHeight ? Number(body.imageHeight) : undefined;
    }

    if ("accent" in body && typeof body.accent === "string") {
      updates.accent = body.accent;
    }
    if ("glow" in body && typeof body.glow === "string") {
      updates.glow = body.glow;
    }

    const updated = await updateProject(body.id, updates);

    if (!updated) {
      return NextResponse.json(
        { error: "Project dengan ID tersebut tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return NextResponse.json(
      { error: getStorageErrorMessage(error, "Gagal memperbarui project.") },
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

    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Project berhasil dihapus." });
  } catch (error) {
    return NextResponse.json(
      { error: getStorageErrorMessage(error, "Gagal menghapus project.") },
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
    revalidatePath("/");
    return NextResponse.json({ success: true, projects: reordered });
  } catch (error) {
    return NextResponse.json(
      { error: getStorageErrorMessage(error, "Gagal mengurutkan project.") },
      { status: 500 }
    );
  }
}
