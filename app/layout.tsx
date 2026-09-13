import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-rashad.vercel.app"
  ),
  title: {
    default: "Rashad Shaquille Taofik | Developer Portfolio",
    template: "%s | Rashad Shaquille Taofik",
  },
  description:
    "Informatics Engineering Student at Universitas Komputer Indonesia (UNIKOM) & AI Enthusiast specializing in Data Science, Web Architecture, and Cisco Network Infrastructure.",
  applicationName: "Rashad Shaquille Taofik Portfolio",
  authors: [
    {
      name: "Rashad Shaquille Taofik",
      url: "https://github.com/rasatshq",
    },
  ],
  creator: "Rashad Shaquille Taofik",
  publisher: "Rashad Shaquille Taofik",
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
    "Generative AI",
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
    url: "https://portfolio-rashad.vercel.app",
    title: "Rashad Shaquille Taofik | Developer Portfolio",
    description:
      "Informatics Engineering Student at UNIKOM & AI Enthusiast. Integrating software logic, data-driven solutions, and network infrastructure.",
    siteName: "Rashad Shaquille Taofik Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rashad Shaquille Taofik | Developer Portfolio",
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
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
