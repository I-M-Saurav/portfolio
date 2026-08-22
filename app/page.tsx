import React from "react";
import { BootSequence } from "@/components/boot-sequence";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { SkillsSection } from "@/components/skills-section";
import { ExperienceSection } from "@/components/experience-section";
import { ProjectsSection } from "@/components/projects-section";
import { ActivitySection } from "@/components/activity-section";
import {
  getProfileServer,
  getCareerLogsServer,
  getExperiencesServer,
  getSkillsServer,
  getProjectsServer,
} from "@/lib/server-data";
import { fetchGitHubStats } from "@/lib/github";
import { fetchCodeforcesStats } from "@/lib/codeforces";

// Force dynamic per-request rendering to guarantee 100% fresh data on every load
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // Fetch all live Firestore collections in parallel on the server
  const [profile, careerLogs, experiences, skills, projects] = await Promise.all([
    getProfileServer(),
    getCareerLogsServer(),
    getExperiencesServer(),
    getSkillsServer(),
    getProjectsServer(),
  ]);

  // Fetch external platform statistics in parallel if handles are configured
  const [githubStats, codeforcesStats] = await Promise.all([
    fetchGitHubStats(profile.githubUsername),
    fetchCodeforcesStats(profile.codeforcesHandle),
  ]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Boot sequence animation on first load */}
      <BootSequence />

      {/* Sticky top navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col space-y-4">
        {/* Hero Section */}
        <section id="hero">
          <Hero initialProfile={profile} />
        </section>

        {/* About Section */}
        <AboutSection initialProfile={profile} initialCareerLogs={careerLogs} />

        {/* Skills Section */}
        <SkillsSection initialSkills={skills} />

        {/* Experience Section */}
        <ExperienceSection initialExperiences={experiences} />

        {/* Projects Section */}
        <ProjectsSection initialProjects={projects} />

        {/* Activity Section (GitHub + Codeforces Stats) */}
        <ActivitySection
          githubStats={githubStats}
          githubUsername={profile.githubUsername}
          codeforcesStats={codeforcesStats}
          codeforcesHandle={profile.codeforcesHandle}
        />

        {/* Placeholder anchor targets for future Phase 5+ sections */}
        <div className="sr-only">
          <div id="education" />
          <div id="positions" />
          <div id="contact" />
        </div>
      </main>

      {/* Minimalistic Terminal Footer */}
      <footer className="w-full border-t border-black/10 dark:border-white/10 py-8 px-6 md:px-12 text-center font-mono text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {profile.name || "Portfolio"}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>sys_status: operational</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
