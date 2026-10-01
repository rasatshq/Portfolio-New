import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "portfolio_admin_session";

// Secret salt to ensure session token cannot be guessed
const AUTH_SALT = process.env.ADMIN_SESSION_SALT ?? "portfolio-salt-2026-shaq";

/**
 * Returns the configured admin password from environment,
 * or a default fallback if not set.
 */
export function getAdminPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) {
    return "admin123";
  }
  return pwd.trim().replace(/^["']|["']$/g, "");
}

/**
 * Computes a deterministic session token from the admin password and salt.
 */
export function generateExpectedSessionToken(): string {
  const password = getAdminPassword();
  return crypto
    .createHash("sha256")
    .update(`${password}:${AUTH_SALT}`)
    .digest("hex");
}

/**
 * Validates a plain password against the configured admin password.
 */
export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!password || !expected) return false;

  const cleanPassword = password.trim();
  const cleanExpected = expected.trim();

  // Timing safe comparison to prevent timing attacks
  const bufA = Buffer.from(cleanPassword);
  const bufB = Buffer.from(cleanExpected);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Checks if the request contains a valid admin session cookie.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return false;

  const expectedToken = generateExpectedSessionToken();
  const bufA = Buffer.from(sessionCookie.value);
  const bufB = Buffer.from(expectedToken);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
