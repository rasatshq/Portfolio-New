import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { GitHubRepos } from "@/components/GitHubRepos";
import { Languages } from "@/components/Languages";
import { Footer } from "@/components/Footer";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      {/* Background Dot Grid & Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.07) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-cyan-400/25 via-blue-400/15 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[45%] -right-48 w-[600px] h-[600px] bg-indigo-400/15 blur-[170px] rounded-full" />
        <div className="absolute bottom-10 -left-48 w-[500px] h-[500px] bg-cyan-400/15 blur-[170px] rounded-full" />
      </div>

      {/* Floating Pill Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-28 space-y-32">
        <Hero />
        <About />
        <Experience />
        <TechStack />
        <Projects />
        <GitHubRepos />
        <Languages />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
