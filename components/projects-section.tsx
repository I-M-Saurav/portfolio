"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { ProjectDocument } from "@/types/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  FolderGit2,
  Github,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface ProjectsSectionProps {
  initialProjects?: ProjectDocument[];
}

export function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<ProjectDocument[]>(initialProjects || []);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [initialProjects?.[0]?.id || "0"]: true, // First project expanded by default
  });

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const db = getFirebaseDb();
      const projQuery = query(collection(db, "projects"), orderBy("order", "asc"));
      unsubscribe = onSnapshot(
        projQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: ProjectDocument[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...(docSnap.data() as Omit<ProjectDocument, "id">) });
            });

            // Sort featured first, then by order asc
            const sorted = list.sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return (a.order || 0) - (b.order || 0);
            });

            setProjects(sorted);
            if (sorted[0]?.id) {
              setExpandedIds((prev) => (Object.keys(prev).length === 0 ? { [sorted[0].id!]: true } : prev));
            }
          }
        },
        (err) => {
          console.warn("ProjectsSection: onSnapshot error:", err);
        }
      );
    } catch (err) {
      console.warn("ProjectsSection: initialization error:", err);
    }

    return () => unsubscribe();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base sm:text-lg font-bold">05.</span>
        <h2 className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-zinc-900 dark:text-white tracking-tight">
          Featured Projects &amp; Systems
        </h2>
        <div className="h-[1px] bg-black/10 dark:bg-white/10 flex-grow ml-4 max-w-md hidden sm:block" />
      </div>

      {/* Terminal Window Card Container */}
      <div className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Terminal Top Window Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-200/70 dark:bg-zinc-900/90 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <div className="ml-2 sm:ml-3 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] sm:text-xs">projects --list</span>
            </div>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 font-mono text-[10px] sm:text-[11px]">
            {projects.length} repositories cataloged
          </div>
        </div>

        {/* Project List Container */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-3 sm:space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-14 text-zinc-500 dark:text-zinc-400 font-mono text-xs italic">
              Projects loading soon — check back later
            </div>
          ) : (
            projects.map((project, idx) => {
              const id = project.id || String(idx);
              const isExpanded = !!expandedIds[id];

              return (
                <div
                  key={id}
                  className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                    project.featured
                      ? "border-emerald-500/40 bg-emerald-500/[0.02] dark:bg-emerald-950/[0.15] shadow-sm shadow-emerald-500/5 hover:border-emerald-500/60"
                      : "border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/30 hover:border-emerald-500/30"
                  }`}
                >
                  {/* Collapsed Header / Click to Expand */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(id)}
                    className="w-full min-h-[48px] p-3.5 sm:p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 font-mono cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 active:bg-black/5 dark:active:bg-white/5"
                    aria-expanded={isExpanded}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                        <FolderGit2
                          className={`w-4 h-4 shrink-0 ${
                            project.featured ? "text-emerald-500" : "text-zinc-400"
                          }`}
                        />
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-zinc-900 dark:text-white break-words">
                          {project.title}
                        </h3>

                        {project.featured && (
                          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">
                            <Sparkles className="w-3 h-3" />
                            <span>FEATURED</span>
                          </span>
                        )}
                      </div>

                      {/* Tech Stack Chips in Header */}
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {project.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono hidden sm:inline">
                        {isExpanded ? "collapse" : "expand details"}
                      </span>
                      <div className="p-1 rounded bg-black/5 dark:bg-white/5 text-zinc-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Body Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-black/10 dark:border-white/10 px-3.5 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-5"
                      >
                        {/* Description Paragraph */}
                        <p className="font-sans text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Action Buttons: GitHub & Live Demo */}
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 font-mono text-xs font-semibold shadow-md transition-all active:scale-[0.98]"
                            >
                              <Github className="w-4 h-4" />
                              <span>Source Code</span>
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                            </a>
                          )}

                          {project.liveUrl && project.liveUrl.trim() !== "" && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Live Demo</span>
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
