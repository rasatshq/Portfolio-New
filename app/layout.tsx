import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PROFILE } from "@/constants/profile";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Single source of truth for the canonical site URL.
// Set NEXT_PUBLIC_SITE_URL in your deployment environment (e.g. Vercel).
// See .env.example for details.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-rashad.vercel.app";

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    "[layout] NEXT_PUBLIC_SITE_URL is not set — " +
      "falling back to hardcoded URL for metadataBase and OG tags. " +
      "Set this env var in your deployment to avoid incorrect canonical URLs."
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PROFILE.name} | Developer Portfolio`,
    template: `%s | ${PROFILE.name}`,
  },
  description:
    "Informatics Engineering Student at Universitas Komputer Indonesia (UNIKOM) & AI Enthusiast specializing in Data Science, Web Architecture, and Cisco Network Infrastructure.",
  applicationName: `${PROFILE.name} Portfolio`,
  authors: [
    {
      name: PROFILE.name,
      url: PROFILE.github,
    },
  ],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  keywords: [
    "Rashad Shaquille Taofik",
    "Rashad Portfolio",
    "UNIKOM",
    "Informatics Engineering",
    "Teknik Informatika",
    "Data Science",
    "Python",
    "NumPy",
    "Web Development",
    "Cisco Packet Tracer",
    "VLSM",
    "Gemini API",
    "Frontend Developer",
    "Bandung",
    "Bekasi",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${PROFILE.name} | Developer Portfolio`,
    description:
      "Informatics Engineering Student at UNIKOM & AI Enthusiast. Integrating software logic, data-driven solutions, and network infrastructure.",
    siteName: `${PROFILE.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} | Developer Portfolio`,
    description:
      "Informatics Engineering Student at UNIKOM & AI Enthusiast. Integrating software logic, data-driven solutions, and network infrastructure.",
    creator: "@rasatshq",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth antialiased ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
