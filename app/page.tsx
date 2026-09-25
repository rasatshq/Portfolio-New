import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { GitHubRepos } from "@/components/GitHubRepos";
import { Languages } from "@/components/Languages";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getProjects } from "@/lib/projects";
import { getSkills } from "@/lib/skills";
import { getProfile } from "@/lib/profile";

export default async function Portfolio() {
  const [projects, skills, profile] = await Promise.all([
    getProjects(),
    getSkills(),
    getProfile(),
  ]);

  return (
    <div id="top" className="editorial-site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="page-container">
        <Hero profile={profile} />
        <Projects initialProjects={projects} />
        <About />
        <Experience />
        <TechStack initialGroups={skills} />
        <GitHubRepos />
        <Languages />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
