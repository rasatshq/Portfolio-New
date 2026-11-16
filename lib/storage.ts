import fs from "fs/promises";
import path from "path";
import { get as blobGet, put as blobPut } from "@vercel/blob";

export type CmsDataFile = "profile.json" | "projects.json" | "skills.json";

export type StorageMode = "vercel-blob" | "redis" | "github" | "local" | "read-only";

export interface StorageStatus {
  mode: StorageMode;
  writable: boolean;
  label: string;
  warning?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

let cachedBlobAccess: "private" | "public" | null = null;

function getRedisConfig(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL?.trim() ||
    process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token =
    process.env.KV_REST_API_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (url && token) {
    return { url: url.replace(/\/+$/, ""), token };
  }
  return null;
}

function getBlobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || null;
}

function getGitHubCmsConfig(): {
  token: string;
  repo: string;
  branch: string;
} | null {
  const token = process.env.GITHUB_TOKEN?.trim();
  const enabled = Boolean(process.env.VERCEL || process.env.GITHUB_CMS === "true");
  if (!token || !enabled) return null;

  const repo = process.env.GITHUB_CMS_REPO?.trim() || "rasatshq/Portfolio-New";
  const branch = process.env.GITHUB_CMS_BRANCH?.trim() || "main";
  return { token, repo, branch };
}

export function getStorageStatus(): StorageStatus {
  if (getBlobToken()) {
    return { mode: "vercel-blob", writable: true, label: "Vercel Blob" };
  }
  if (getRedisConfig()) {
    return { mode: "redis", writable: true, label: "Upstash / Vercel KV" };
  }
  if (getGitHubCmsConfig()) {
    return { mode: "github", writable: true, label: "GitHub Repository API" };
  }
  if (process.env.VERCEL) {
    return {
      mode: "read-only",
      writable: false,
      label: "Vercel Read-Only Filesystem",
      warning:
        "Hosting Vercel bersifat read-only. Sambungkan Vercel Blob (klik Connect to Project pada Blob Store agar BLOB_READ_WRITE_TOKEN terpasang) atau atur Upstash Redis / GITHUB_TOKEN dengan izin tulis, lalu redeploy.",
    };
  }
  return { mode: "local", writable: true, label: "Local Filesystem" };
}

// ─── Local Filesystem helpers ────────────────────────────────────────────────

async function readLocalJson<T>(fileName: CmsDataFile): Promise<T | null> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

async function writeLocalJson<T>(fileName: CmsDataFile, data: T): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      path.join(DATA_DIR, fileName),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err?.code === "EROFS" || err?.code === "EACCES" || err?.code === "EPERM") {
      throw new Error(
        "Server Vercel memiliki filesystem read-only. Pastikan Vercel Blob Store sudah di-Connect to Project (BLOB_READ_WRITE_TOKEN) lalu Redeploy."
      );
    }
    throw error;
  }
}

// ─── Upstash Redis / Vercel KV REST helpers ──────────────────────────────────

async function redisCommand<T = unknown>(command: string[]): Promise<T> {
  const cfg = getRedisConfig();
  if (!cfg) throw new Error("Redis config not found");

  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Redis error (${res.status}): ${text || res.statusText}`);
  }

  const json = (await res.json()) as { result: T; error?: string };
  if (json.error) {
    throw new Error(`Redis error: ${json.error}`);
  }
  return json.result;
}

// ─── Vercel Blob SDK helpers (supports both private and public stores) ───────

function getBlobAccessCandidates(): Array<"private" | "public"> {
  const envAccess = process.env.BLOB_ACCESS?.trim().toLowerCase();
  if (envAccess === "public" || envAccess === "private") {
    return [envAccess];
  }
  if (cachedBlobAccess) {
    return [cachedBlobAccess, cachedBlobAccess === "private" ? "public" : "private"];
  }
  return ["private", "public"];
}

function isAccessMismatchError(error: unknown): boolean {
  const msg = ((error as Error)?.message || "").toLowerCase();
  const name = ((error as Error)?.name || "").toLowerCase();
  return (
    name.includes("blobaccesserror") ||
    msg.includes("private") ||
    msg.includes("public") ||
    msg.includes("access") ||
    msg.includes("403") ||
    msg.includes("forbidden")
  );
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

async function blobPutAuto(
  pathname: string,
  body: string | Buffer,
  options: {
    contentType: string;
    allowOverwrite?: boolean;
    addRandomSuffix?: boolean;
    cacheControlMaxAge?: number;
  }
): Promise<{ url: string; access: "private" | "public" }> {
  const candidates = getBlobAccessCandidates();
  let lastError: unknown;

  for (const access of candidates) {
    try {
      const result = await blobPut(pathname, body, {
        access,
        contentType: options.contentType,
        allowOverwrite: options.allowOverwrite,
        addRandomSuffix: options.addRandomSuffix ?? false,
        cacheControlMaxAge: options.cacheControlMaxAge,
      });
      cachedBlobAccess = access;
      return { url: result.url, access };
    } catch (error) {
      lastError = error;
      if (!isAccessMismatchError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

async function blobGetAuto(pathname: string): Promise<Buffer | null> {
  const candidates = getBlobAccessCandidates();

  for (const access of candidates) {
    try {
      const result = await blobGet(pathname, {
        access,
        useCache: false,
      });
      if (!result || result.statusCode !== 200 || !result.stream) {
        return null;
      }
      cachedBlobAccess = access;
      return await streamToBuffer(result.stream);
    } catch {
      // Try next access candidate (e.g. store may be public instead of private)
    }
  }

  return null;
}

// ─── GitHub Repository Contents API helpers ──────────────────────────────────

async function githubGetFile(
  repoPath: string
): Promise<{ content: Buffer; sha: string } | null> {
  const cfg = getGitHubCmsConfig();
  if (!cfg) return null;

  const url = `https://api.github.com/repos/${cfg.repo}/contents/${repoPath}?ref=${encodeURIComponent(cfg.branch)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-cms",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const json = (await res.json()) as { content?: string; sha?: string };
  if (!json.content || !json.sha) return null;

  return {
    content: Buffer.from(json.content.replace(/\n/g, ""), "base64"),
    sha: json.sha,
  };
}

async function githubPutFile(
  repoPath: string,
  buffer: Buffer,
  commitMessage: string
): Promise<void> {
  const cfg = getGitHubCmsConfig();
  if (!cfg) throw new Error("GITHUB_TOKEN tidak dikonfigurasi.");

  const existing = await githubGetFile(repoPath);
  const url = `https://api.github.com/repos/${cfg.repo}/contents/${repoPath}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "portfolio-cms",
    },
    body: JSON.stringify({
      message: commitMessage,
      content: buffer.toString("base64"),
      branch: cfg.branch,
      ...(existing?.sha ? { sha: existing.sha } : {}),
    }),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      throw new Error(
        `GitHub API menolak penulisan ke ${cfg.repo} (${res.status}). Pastikan GITHUB_TOKEN memiliki izin 'Contents: Read and write', atau hubungkan Vercel Blob (BLOB_READ_WRITE_TOKEN) / Upstash Redis di Vercel Storage.`
      );
    }
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API error (${res.status}): ${text || res.statusText}`);
  }
}

// ─── Public Unified Storage API ──────────────────────────────────────────────

export async function readCmsJson<T>(
  fileName: CmsDataFile,
  fallback: T,
  validate?: (value: unknown) => value is T
): Promise<T> {
  const isValid = (val: unknown): val is T =>
    validate ? validate(val) : val !== null && val !== undefined;

  if (getBlobToken()) {
    try {
      const buf = await blobGetAuto(`cms/${fileName}`);
      if (buf) {
        const parsed = JSON.parse(buf.toString("utf-8")) as unknown;
        if (isValid(parsed)) return parsed;
      }
    } catch {
      // fall through to bundled seed
    }
    const localSeed = await readLocalJson<unknown>(fileName);
    return isValid(localSeed) ? localSeed : fallback;
  }

  if (getRedisConfig()) {
    try {
      const raw = await redisCommand<string | null>(["GET", `cms:${fileName}`]);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (isValid(parsed)) return parsed;
      }
    } catch {
      // fall through to bundled seed
    }
    const localSeed = await readLocalJson<unknown>(fileName);
    return isValid(localSeed) ? localSeed : fallback;
  }

  if (getGitHubCmsConfig()) {
    try {
      const file = await githubGetFile(`data/${fileName}`);
      if (file) {
        const parsed = JSON.parse(file.content.toString("utf-8")) as unknown;
        if (isValid(parsed)) return parsed;
      }
    } catch {
      // fall through to bundled seed
    }
    const localSeed = await readLocalJson<unknown>(fileName);
    return isValid(localSeed) ? localSeed : fallback;
  }

  const localData = await readLocalJson<unknown>(fileName);
  if (isValid(localData)) {
    return localData;
  }

  try {
    await writeLocalJson(fileName, fallback);
  } catch {
    // ignore seed write failure in read-only environment
  }
  return fallback;
}

export async function writeCmsJson<T>(
  fileName: CmsDataFile,
  data: T
): Promise<void> {
  if (getBlobToken()) {
    await blobPutAuto(`cms/${fileName}`, JSON.stringify(data, null, 2), {
      contentType: "application/json",
      allowOverwrite: true,
      addRandomSuffix: false,
      cacheControlMaxAge: 60,
    });
    return;
  }

  if (getRedisConfig()) {
    await redisCommand(["SET", `cms:${fileName}`, JSON.stringify(data)]);
    return;
  }

  if (getGitHubCmsConfig()) {
    await githubPutFile(
      `data/${fileName}`,
      Buffer.from(JSON.stringify(data, null, 2), "utf-8"),
      `chore(cms): update ${fileName}`
    );
    return;
  }

  await writeLocalJson(fileName, data);
}

export async function saveUploadedMedia(
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  if (getBlobToken()) {
    const result = await blobPutAuto(`uploads/${fileName}`, buffer, {
      contentType,
      addRandomSuffix: false,
    });
    return result.access === "public" ? result.url : `/api/uploads/${fileName}`;
  }

  if (getRedisConfig()) {
    if (buffer.length > 4 * 1024 * 1024) {
      throw new Error(
        "Ukuran file terlalu besar untuk penyimpanan Redis (maksimal 4 MB). Gunakan Vercel Blob atau URL gambar eksternal."
      );
    }
    await redisCommand([
      "SET",
      `cms:upload:${fileName}`,
      JSON.stringify({ contentType, data: buffer.toString("base64") }),
    ]);
    return `/api/uploads/${fileName}`;
  }

  if (getGitHubCmsConfig()) {
    await githubPutFile(
      `data/uploads/${fileName}`,
      buffer,
      `chore(cms): upload ${fileName}`
    );
    return `/api/uploads/${fileName}`;
  }

  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, fileName), buffer);
    return `/api/uploads/${fileName}`;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err?.code === "EROFS" || err?.code === "EACCES" || err?.code === "EPERM") {
      throw new Error(
        "Server Vercel memiliki filesystem read-only sehingga upload file lokal tidak didukung tanpa storage eksternal. Pastikan Vercel Blob Store sudah di-Connect to Project (BLOB_READ_WRITE_TOKEN) lalu Redeploy."
      );
    }
    throw error;
  }
}

export async function readUploadedMedia(
  fileName: string
): Promise<Buffer | null> {
  if (getBlobToken()) {
    try {
      const buf = await blobGetAuto(`uploads/${fileName}`);
      if (buf) return buf;
    } catch {
      // fall through
    }
  }

  if (getRedisConfig()) {
    try {
      const raw = await redisCommand<string | null>([
        "GET",
        `cms:upload:${fileName}`,
      ]);
      if (raw) {
        const parsed = JSON.parse(raw) as { data?: string };
        if (parsed.data) {
          return Buffer.from(parsed.data, "base64");
        }
      }
    } catch {
      // fall through
    }
  }

  if (getGitHubCmsConfig()) {
    try {
      const file = await githubGetFile(`data/uploads/${fileName}`);
      if (file) return file.content;
    } catch {
      // fall through
    }
  }

  return null;
}
