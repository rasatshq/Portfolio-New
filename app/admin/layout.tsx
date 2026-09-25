import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin CMS | Portfolio Project Manager",
  description: "Dashboard admin untuk mengelola dan mengedit proyek portofolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen text-[var(--foreground)] selection:bg-teal-200">
      {children}
    </div>
  );
}
