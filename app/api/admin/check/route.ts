import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getStorageStatus } from "@/lib/storage";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    storage: getStorageStatus(),
  });
}
