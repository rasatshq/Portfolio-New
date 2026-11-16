const DANGEROUS_PROTOCOL_RE = /^(javascript|vbscript|file):/i;
const DATA_IMAGE_RE = /^data:image\/[a-zA-Z0-9.+-]+(?:;[a-zA-Z0-9=+-]+)*,(?:.+)$/i;

/**
 * Checks whether a string is safe and structurally valid for next/image `src`.
 * Prevents runtime crashes in next/image while users type partial URLs or enter
 * malformed paths.
 */
export function isValidImageSrc(src: string | null | undefined): boolean {
  if (!src) return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (DANGEROUS_PROTOCOL_RE.test(trimmed)) return false;

  if (trimmed.startsWith("/")) {
    return !trimmed.startsWith("//");
  }

  if (trimmed.startsWith("data:")) {
    return DATA_IMAGE_RE.test(trimmed);
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      return Boolean(parsed.hostname) && (parsed.protocol === "http:" || parsed.protocol === "https:");
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Returns true for dynamic/external image sources that should bypass
 * `/_next/image` optimization so arbitrary remote hosts, runtime uploads,
 * SVGs, and data URLs never trigger Next.js hostname or 400 errors.
 */
export function shouldBypassImageOptimization(src: string | null | undefined): boolean {
  if (!src) return false;
  const trimmed = src.trim();
  if (/^(https?:\/\/|data:)/i.test(trimmed)) return true;
  if (trimmed.startsWith("/api/uploads/")) return true;
  const cleanPath = trimmed.split(/[?#]/)[0].toLowerCase();
  return cleanPath.endsWith(".svg");
}

export interface UrlValidationResult {
  ok: boolean;
  value: string;
  error?: string;
}

/**
 * Normalizes and validates an image URL or local path before saving.
 */
export function normalizeImageInput(input: unknown): UrlValidationResult {
  if (input === undefined || input === null) {
    return { ok: true, value: "" };
  }
  if (typeof input !== "string") {
    return { ok: false, value: "", error: "URL gambar harus berupa teks." };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: true, value: "" };
  }

  if (DANGEROUS_PROTOCOL_RE.test(trimmed) || (trimmed.startsWith("data:") && !DATA_IMAGE_RE.test(trimmed))) {
    return { ok: false, value: "", error: "Format URL gambar tidak diizinkan." };
  }

  const candidate = /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed;
  if (!isValidImageSrc(candidate)) {
    return {
      ok: false,
      value: "",
      error: "URL foto harus diawali '/' (misal: /profile.jpg) atau 'https://' (misal: https://...).",
    };
  }

  return { ok: true, value: candidate };
}

/**
 * Normalizes and validates a portfolio link (GitHub, Live Demo, LinkedIn, CV).
 * Automatically prepends `https://` for bare domains like `github.com/user`.
 */
export function normalizeLinkUrl(input: unknown): UrlValidationResult {
  if (input === undefined || input === null) {
    return { ok: true, value: "" };
  }
  if (typeof input !== "string") {
    return { ok: false, value: "", error: "Link harus berupa teks." };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: true, value: "" };
  }

  if (DANGEROUS_PROTOCOL_RE.test(trimmed) || /^data:/i.test(trimmed)) {
    return {
      ok: false,
      value: "",
      error: "Protokol link tidak diizinkan. Gunakan https://, http://, atau path /.",
    };
  }

  if (/\s/.test(trimmed)) {
    return { ok: false, value: "", error: "Link tidak boleh mengandung spasi." };
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return { ok: true, value: trimmed };
  }

  if (trimmed.startsWith("#") || /^mailto:/i.test(trimmed)) {
    return { ok: true, value: trimmed };
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (!parsed.hostname) {
        return { ok: false, value: "", error: "Format link tidak valid." };
      }
      return { ok: true, value: trimmed };
    } catch {
      return { ok: false, value: "", error: "Format link tidak valid." };
    }
  }

  // Handle bare domain without protocol, e.g. github.com/rasatshq or my-app.vercel.app
  if (!trimmed.includes("://") && !trimmed.startsWith("//")) {
    const withProtocol = `https://${trimmed}`;
    try {
      const parsed = new URL(withProtocol);
      if (parsed.hostname && (parsed.hostname.includes(".") || parsed.hostname === "localhost")) {
        return { ok: true, value: withProtocol };
      }
    } catch {
      // fall through to error
    }
  }

  return {
    ok: false,
    value: "",
    error: "Format link tidak valid. Contoh: https://github.com/... atau /file.pdf",
  };
}

/**
 * Formats storage/filesystem errors into a clear Indonesian message.
 */
export function getStorageErrorMessage(error: unknown, fallback: string): string {
  const err = error as NodeJS.ErrnoException | undefined;
  if (err?.code === "EROFS" || err?.code === "EACCES" || err?.code === "EPERM") {
    return "Server bersifat read-only sehingga perubahan tidak dapat disimpan ke disk. Jalankan di server dengan akses tulis atau gunakan penyimpanan database/blob.";
  }
  return (error as Error)?.message || fallback;
}
