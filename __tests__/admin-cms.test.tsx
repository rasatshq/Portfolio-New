import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import { get as blobGet, put as blobPut } from "@vercel/blob";
import {
  isValidImageSrc,
  normalizeImageInput,
  normalizeLinkUrl,
  shouldBypassImageOptimization,
  getStorageErrorMessage,
} from "@/lib/urls";
import { DEFAULT_PROFILE } from "@/constants/profile";
import { DEFAULT_PROJECTS } from "@/constants/projects";
import { Portrait } from "@/components/Portrait";
import { Projects } from "@/components/Projects";
import { isAuthenticated } from "@/lib/auth";
import { POST as uploadPost } from "@/app/api/admin/upload/route";
import { GET as uploadedFileGet } from "@/app/api/uploads/[filename]/route";
import { PUT as profilePut } from "@/app/api/admin/profile/route";
import { PUT as projectPut, POST as projectPost } from "@/app/api/admin/projects/route";
import {
  getStorageStatus,
  readCmsJson,
  writeCmsJson,
  saveUploadedMedia,
  readUploadedMedia,
} from "@/lib/storage";

vi.mock("fs/promises", () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  },
}));

vi.mock("@vercel/blob", () => ({
  get: vi.fn(),
  put: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string; unoptimized?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} data-unoptimized={String(Boolean(props.unoptimized))} />
  ),
}));

beforeEach(() => {
  vi.mocked(isAuthenticated).mockResolvedValue(true);
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("URL & Image helpers (lib/urls)", () => {
  it("validates local paths, https URLs, and image data URIs safely", () => {
    expect(isValidImageSrc("/profile.jpg")).toBe(true);
    expect(isValidImageSrc("/api/uploads/photo-123.png")).toBe(true);
    expect(isValidImageSrc("https://example.com/photo.png")).toBe(true);
    expect(isValidImageSrc("http://localhost:3000/img.webp")).toBe(true);
    expect(isValidImageSrc("data:image/png;base64,iVBORw0KGgo=")).toBe(true);

    // Partial or malformed values must return false instead of throwing in next/image
    expect(isValidImageSrc("")).toBe(false);
    expect(isValidImageSrc("h")).toBe(false);
    expect(isValidImageSrc("https://")).toBe(false);
    expect(isValidImageSrc("profile.jpg")).toBe(false);
    expect(isValidImageSrc("//evil.com/x.png")).toBe(false);
    expect(isValidImageSrc("javascript:alert(1)")).toBe(false);
    expect(isValidImageSrc("data:text/html,<script>alert(1)</script>")).toBe(false);
  });

  it("bypasses image optimization for external URLs, runtime uploads, SVGs, and data URIs", () => {
    expect(shouldBypassImageOptimization("/profile.jpg")).toBe(false);
    expect(shouldBypassImageOptimization("/prince-ecommerce.png")).toBe(false);
    expect(shouldBypassImageOptimization("/api/uploads/photo-123.png")).toBe(true);
    expect(shouldBypassImageOptimization("https://example.com/photo.png")).toBe(true);
    expect(shouldBypassImageOptimization("/icon.svg")).toBe(true);
    expect(shouldBypassImageOptimization("data:image/png;base64,abc")).toBe(true);
  });

  it("normalizes links and rejects dangerous protocols", () => {
    expect(normalizeLinkUrl("https://github.com/rasatshq")).toEqual({
      ok: true,
      value: "https://github.com/rasatshq",
    });
    expect(normalizeLinkUrl("github.com/rasatshq/repo")).toEqual({
      ok: true,
      value: "https://github.com/rasatshq/repo",
    });
    expect(normalizeLinkUrl("/cv.pdf")).toEqual({ ok: true, value: "/cv.pdf" });
    expect(normalizeLinkUrl("")).toEqual({ ok: true, value: "" });
    expect(normalizeLinkUrl("javascript:alert(1)").ok).toBe(false);
    expect(normalizeLinkUrl("https://bad link.com").ok).toBe(false);
  });

  it("normalizes image inputs and formats read-only storage errors", () => {
    expect(normalizeImageInput("www.example.com/a.png")).toEqual({
      ok: true,
      value: "https://www.example.com/a.png",
    });
    expect(normalizeImageInput("invalid-path.png").ok).toBe(false);
    const roErr = Object.assign(new Error("EROFS: read-only file system"), { code: "EROFS" });
    expect(getStorageErrorMessage(roErr, "fallback")).toContain("read-only");
  });
});

describe("Portrait and Projects safe image rendering", () => {
  it("renders external avatar without throwing and falls back when avatarUrl is invalid", () => {
    const { rerender } = render(
      <Portrait profile={{ ...DEFAULT_PROFILE, avatarUrl: "https://example.com/avatar.jpg" }} />
    );
    const img = screen.getByRole("img", { name: `Portrait of ${DEFAULT_PROFILE.name}` });
    expect(img.getAttribute("src")).toBe("https://example.com/avatar.jpg");
    expect(img.getAttribute("data-unoptimized")).toBe("true");

    rerender(<Portrait profile={{ ...DEFAULT_PROFILE, avatarUrl: "https://" }} />);
    const fallbackImg = screen.getByRole("img", { name: `Portrait of ${DEFAULT_PROFILE.name}` });
    expect(fallbackImg.getAttribute("src")).toBe("/profile.jpg");
  });

  it("renders external project image with unoptimized=true and skips invalid image src", () => {
    const projects = [
      { ...DEFAULT_PROJECTS[0], id: "ext", image: "https://example.com/demo.png" },
      { ...DEFAULT_PROJECTS[0], id: "bad", title: "Bad Img Project", image: "not-a-valid-src" },
    ];
    render(<Projects initialProjects={projects} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(1);
    expect(imgs[0].getAttribute("src")).toBe("https://example.com/demo.png");
    expect(imgs[0].getAttribute("data-unoptimized")).toBe("true");
  });
});

describe("Admin CMS Upload & Serving Routes", () => {
  it("uploads image to data/uploads and returns /api/uploads/ URL", async () => {
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);

    const formData = new FormData();
    formData.append("file", new File([new Uint8Array([137, 80, 78, 71])], "My Photo.png", { type: "image/png" }));

    const req = { formData: async () => formData } as unknown as Request;
    const res = await uploadPost(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.url).toMatch(/^\/api\/uploads\/my-photo-\d+\.png$/);
    expect(vi.mocked(fs.writeFile)).toHaveBeenCalledTimes(1);
  });

  it("serves uploaded image from data/uploads and blocks path traversal", async () => {
    vi.mocked(fs.readFile).mockResolvedValueOnce(Buffer.from([1, 2, 3]));
    const res = await uploadedFileGet(new Request("http://localhost/api/uploads/test-123.png"), {
      params: Promise.resolve({ filename: "test-123.png" }),
    });
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");

    const badRes = await uploadedFileGet(new Request("http://localhost/api/uploads/..%2Fsecret.png"), {
      params: Promise.resolve({ filename: "../secret.png" }),
    });
    expect(badRes.status).toBe(400);
  });
});

describe("Admin CMS Profile & Project Link/Photo Updates", () => {
  it("updates profile photo URL and normalizes profile links", async () => {
    let savedProfile = JSON.stringify(DEFAULT_PROFILE);
    vi.mocked(fs.readFile).mockImplementation(async () => savedProfile);
    vi.mocked(fs.writeFile).mockImplementation(async (_p, content) => {
      savedProfile = String(content);
    });

    const req = new Request("http://localhost/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        avatarUrl: "https://cdn.example.com/new-avatar.jpg",
        github: "github.com/newuser",
        linkedin: "https://www.linkedin.com/in/newuser",
        cvUrl: "/new-cv.pdf",
      }),
    });

    const res = await profilePut(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.profile.avatarUrl).toBe("https://cdn.example.com/new-avatar.jpg");
    expect(json.profile.github).toBe("https://github.com/newuser");
    expect(json.profile.linkedin).toBe("https://www.linkedin.com/in/newuser");
    expect(json.profile.cvUrl).toBe("/new-cv.pdf");
  });

  it("rejects unsafe links in profile update", async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(DEFAULT_PROFILE));
    const req = new Request("http://localhost/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ github: "javascript:alert(1)" }),
    });
    const res = await profilePut(req);
    expect(res.status).toBe(400);
  });

  it("updates project links and image, normalizes bare domains, and clears empty fields", async () => {
    let storedProjects = JSON.stringify(DEFAULT_PROJECTS);
    vi.mocked(fs.readFile).mockImplementation(async () => storedProjects);
    vi.mocked(fs.writeFile).mockImplementation(async (_p, content) => {
      storedProjects = String(content);
    });

    const targetId = DEFAULT_PROJECTS[0].id;
    const putReq = new Request("http://localhost/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: targetId,
        githubUrl: "github.com/rasatshq/updated-repo",
        demoUrl: "demo.example.com",
        image: "/api/uploads/new-shot-123.png",
      }),
    });

    const res = await projectPut(putReq);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.project.githubUrl).toBe("https://github.com/rasatshq/updated-repo");
    expect(body.project.demoUrl).toBe("https://demo.example.com");
    expect(body.project.image).toBe("/api/uploads/new-shot-123.png");
    // Partial update preserves existing title
    expect(body.project.title).toBe(DEFAULT_PROJECTS[0].title);

    // Clearing links & image explicitly removes them
    const clearReq = new Request("http://localhost/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: targetId,
        githubUrl: "",
        demoUrl: "",
        image: "",
      }),
    });
    const clearRes = await projectPut(clearReq);
    const clearBody = await clearRes.json();
    expect(clearRes.status).toBe(200);
    expect(clearBody.project.githubUrl).toBeUndefined();
    expect(clearBody.project.demoUrl).toBeUndefined();
    expect(clearBody.project.image).toBeUndefined();
  });

  it("rejects invalid image or link on project creation", async () => {
    const req = new Request("http://localhost/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Project",
        description: "Desc",
        image: "no-leading-slash.png",
      }),
    });
    const res = await projectPost(req);
    expect(res.status).toBe(400);
  });
});

describe("Vercel / Serverless Storage Backends (lib/storage)", () => {
  it("reports storage mode based on environment variables", () => {
    expect(getStorageStatus().mode).toBe("local");

    vi.stubEnv("VERCEL", "1");
    expect(getStorageStatus()).toMatchObject({ mode: "read-only", writable: false });

    vi.stubEnv("GITHUB_TOKEN", "ghp_test");
    expect(getStorageStatus()).toMatchObject({ mode: "github", writable: true });

    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    expect(getStorageStatus()).toMatchObject({ mode: "redis", writable: true });

    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_test");
    expect(getStorageStatus()).toMatchObject({ mode: "vercel-blob", writable: true });
  });

  it("reads and writes CMS JSON & media via Vercel Blob (including private stores)", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_test");
    const blobStore = new Map<string, Uint8Array>();

    vi.mocked(blobPut).mockImplementation(async (pathname, body, opts) => {
      expect(opts.access).toBe("private");
      const bytes =
        typeof body === "string"
          ? new TextEncoder().encode(body)
          : new Uint8Array(body as Buffer);
      blobStore.set(pathname, bytes);
      return {
        url: `https://store.private.blob.vercel-storage.com/${pathname}`,
        downloadUrl: `https://store.private.blob.vercel-storage.com/${pathname}?download=1`,
        pathname,
        contentType: opts.contentType || "application/octet-stream",
        contentDisposition: "inline",
        etag: "etag-1",
      };
    });

    vi.mocked(blobGet).mockImplementation(async (pathname) => {
      const bytes = blobStore.get(pathname);
      if (!bytes) return null;
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      });
      return {
        statusCode: 200,
        stream,
        headers: new Headers() as never,
        blob: {
          url: `https://store.private.blob.vercel-storage.com/${pathname}`,
          downloadUrl: `https://store.private.blob.vercel-storage.com/${pathname}?download=1`,
          pathname,
          contentType: "application/json",
          contentDisposition: "inline",
          cacheControl: "",
          uploadedAt: new Date(),
          etag: "etag-1",
          size: bytes.length,
        },
      };
    });

    await writeCmsJson("profile.json", { ...DEFAULT_PROFILE, name: "Blob Name" });
    const loaded = await readCmsJson("profile.json", DEFAULT_PROFILE);
    expect(loaded.name).toBe("Blob Name");

    const mediaUrl = await saveUploadedMedia("avatar-1.png", Buffer.from([1, 2, 3]), "image/png");
    expect(mediaUrl).toBe("/api/uploads/avatar-1.png");
    const mediaBytes = await readUploadedMedia("avatar-1.png");
    expect(mediaBytes).toEqual(Buffer.from([1, 2, 3]));
  });

  it("reads and writes CMS JSON & media via Upstash Redis / Vercel KV REST API", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "redis_tok");
    const kv = new Map<string, string>();

    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
        const cmd = JSON.parse(String(init?.body)) as string[];
        if (cmd[0] === "SET") {
          kv.set(cmd[1], cmd[2]);
          return new Response(JSON.stringify({ result: "OK" }), { status: 200 });
        }
        if (cmd[0] === "GET") {
          return new Response(JSON.stringify({ result: kv.get(cmd[1]) ?? null }), { status: 200 });
        }
        return new Response("bad", { status: 400 });
      })
    );

    await writeCmsJson("profile.json", { ...DEFAULT_PROFILE, name: "Redis Name" });
    const loaded = await readCmsJson("profile.json", DEFAULT_PROFILE);
    expect(loaded.name).toBe("Redis Name");

    const uploadUrl = await saveUploadedMedia("shot-1.png", Buffer.from([9, 8, 7]), "image/png");
    expect(uploadUrl).toBe("/api/uploads/shot-1.png");
    const bytes = await readUploadedMedia("shot-1.png");
    expect(bytes).toEqual(Buffer.from([9, 8, 7]));
  });

  it("reads and writes CMS JSON via GitHub Contents API on Vercel and surfaces clear permission error on 403", async () => {
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("GITHUB_TOKEN", "ghp_rw_test");

    let savedB64 = Buffer.from(JSON.stringify(DEFAULT_PROFILE)).toString("base64");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
        if (init?.method === "PUT") {
          const payload = JSON.parse(String(init.body)) as { content: string };
          savedB64 = payload.content;
          return new Response(JSON.stringify({ content: { sha: "newsha" } }), { status: 200 });
        }
        return new Response(JSON.stringify({ content: savedB64, sha: "oldsha" }), { status: 200 });
      })
    );

    await writeCmsJson("profile.json", { ...DEFAULT_PROFILE, name: "GitHub Name" });
    const loaded = await readCmsJson("profile.json", DEFAULT_PROFILE);
    expect(loaded.name).toBe("GitHub Name");

    // 403 permission error produces actionable message
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
        if (init?.method === "PUT") {
          return new Response(JSON.stringify({ message: "Resource not accessible by personal access token" }), { status: 403 });
        }
        return new Response(JSON.stringify({ message: "Not Found" }), { status: 404 });
      })
    );

    await expect(writeCmsJson("profile.json", DEFAULT_PROFILE)).rejects.toThrow("Contents: Read and write");
  });
});
