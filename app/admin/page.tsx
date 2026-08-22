"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import {
  User,
  GitCommit,
  Briefcase,
  Cpu,
  GraduationCap,
  FolderGit2,
  ShieldCheck,
  Mail,
  LogOut,
  Terminal,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileManager } from "@/components/admin/profile-manager";
import { CareerManager } from "@/components/admin/career-manager";
import { ExperienceManager } from "@/components/admin/experience-manager";
import { SkillsManager } from "@/components/admin/skills-manager";
import { EducationManager } from "@/components/admin/education-manager";
import { ProjectsManager } from "@/components/admin/projects-manager";
import { PositionsManager } from "@/components/admin/positions-manager";
import { ContactManager } from "@/components/admin/contact-manager";
import { motion, AnimatePresence } from "framer-motion";

type AdminTab =
  | "profile"
  | "career"
  | "experience"
  | "skills"
  | "education"
  | "projects"
  | "positions"
  | "contact";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("profile");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(getFirebaseAuth());
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "profile", label: "Profile & About", icon: User },
    { id: "career", label: "Career Log", icon: GitCommit },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "positions", label: "Positions", icon: ShieldCheck },
    { id: "contact", label: "Contact & Socials", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0e0e14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 min-h-[40px] px-2 text-xs font-mono text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">return to site</span>
            </Link>
            <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 hidden sm:block shrink-0" />
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
              <Terminal className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">Admin Console</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hidden md:inline-flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3" />
                AUTHENTICATED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3 sm:px-3.5 py-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-mono text-xs font-medium transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 flex-grow">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-black/10 dark:border-white/10 font-mono text-xs no-scrollbar touch-scroll">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 min-h-[40px] px-3.5 sm:px-4 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20"
                    : "bg-white/40 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-zinc-200 border border-black/10 dark:border-white/10"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container with Smooth Animation */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md p-4 sm:p-6 md:p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "profile" && <ProfileManager />}
              {activeTab === "career" && <CareerManager />}
              {activeTab === "experience" && <ExperienceManager />}
              {activeTab === "skills" && <SkillsManager />}
              {activeTab === "education" && <EducationManager />}
              {activeTab === "projects" && <ProjectsManager />}
              {activeTab === "positions" && <PositionsManager />}
              {activeTab === "contact" && <ContactManager />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-4 px-6 text-center font-mono text-xs text-zinc-500">
        <span>Portfolio Admin Console &bull; Connected to Firestore &amp; Firebase Storage</span>
      </footer>
    </div>
  );
}
