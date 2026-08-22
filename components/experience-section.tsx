"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { ExperienceDocument } from "@/types/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Briefcase, ChevronDown, ChevronUp, MapPin, Calendar } from "lucide-react";

const FALLBACK_EXPERIENCE: ExperienceDocument[] = [
  {
    id: "1",
    company: "Acme Cloud Technologies",
    role: "Software Engineering Intern",
    duration: "Jun 2025 - Aug 2025",
    location: "Seattle, WA (Hybrid)",
    description: [
      "Engineered microservices for real-time telemetry processing using Go and gRPC, reducing latency by 35%.",
      "Designed and deployed automated CI/CD pipelines on AWS EKS using Terraform and GitHub Actions.",
      "Collaborated with senior architects to optimize PostgreSQL query indexes handling over 10M rows daily.",
    ],
    techStack: ["Go", "gRPC", "PostgreSQL", "Docker", "Kubernetes", "AWS"],
    order: 1,
  },
  {
    id: "2",
    company: "DevSprint Labs",
    role: "Full-Stack Developer Intern",
    duration: "Jan 2025 - May 2025",
    location: "Remote",
    description: [
      "Built responsive client portals with Next.js 14 (App Router), TypeScript, and Tailwind CSS.",
      "Integrated Firebase Authentication with custom claims and Firestore real-time subscriptions.",
      "Implemented automated end-to-end testing suite achieving 92% coverage across core user flows.",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Node.js", "Jest"],
    order: 2,
  },
];

interface ExperienceSectionProps {
  initialExperiences?: ExperienceDocument[];
}

export function ExperienceSection({ initialExperiences }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<ExperienceDocument[]>(
    initialExperiences && initialExperiences.length > 0 ? initialExperiences : FALLBACK_EXPERIENCE
  );
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [experiences[0]?.id || "1"]: true,
  });

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const db = getFirebaseDb();
      const expQuery = query(collection(db, "experience"), orderBy("order", "asc"));
      unsubscribe = onSnapshot(
        expQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: ExperienceDocument[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...(docSnap.data() as Omit<ExperienceDocument, "id">) });
            });
            setExperiences(list);
            if (list[0]?.id) {
              setExpandedIds((prev) => (Object.keys(prev).length === 0 ? { [list[0].id!]: true } : prev));
            }
          }
        },
        (err) => {
          console.warn("ExperienceSection: onSnapshot error:", err);
        }
      );
    } catch (err) {
      console.warn("ExperienceSection: initialization error:", err);
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
    <section id="experience" className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base sm:text-lg font-bold">03.</span>
        <h2 className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-zinc-900 dark:text-white tracking-tight">
          Professional Experience
        </h2>
        <div className="h-[1px] bg-black/10 dark:bg-white/10 flex-grow ml-4 max-w-md hidden sm:block" />
      </div>

      {/* Terminal Window Card */}
      <div className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Terminal Top Window Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-200/70 dark:bg-zinc-900/90 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <div className="ml-2 sm:ml-3 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] sm:text-xs">experience --list</span>
            </div>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 font-mono text-[10px] sm:text-[11px]">
            {experiences.length} positions recorded
          </div>
        </div>

        {/* Experience List Container */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-3 sm:space-y-4">
          {experiences.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 font-mono text-xs italic">
              No experience logged yet
            </div>
          ) : (
            experiences.map((exp, idx) => {
              const id = exp.id || String(idx);
              const isExpanded = !!expandedIds[id];

              return (
                <div
                  key={id}
                  className="rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/30 overflow-hidden transition-all duration-200 hover:border-emerald-500/30"
                >
                  {/* Collapsed Header / Click to Expand */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(id)}
                    className="w-full min-h-[48px] p-3.5 sm:p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 font-mono cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 active:bg-black/5 dark:active:bg-white/5"
                    aria-expanded={isExpanded}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-500 shrink-0" />
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-zinc-900 dark:text-white break-words">
                          {exp.role}
                        </h3>
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs">@</span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold break-words">
                          {exp.company}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-0.5 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 pl-0 sm:pl-6">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>{exp.duration}</span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
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
                        className="border-t border-black/10 dark:border-white/10 px-3.5 sm:px-5 py-4 sm:py-5 space-y-3.5 sm:space-y-4"
                      >
                        {/* Bullet Points */}
                        <div className="space-y-2 pl-1 sm:pl-2">
                          {exp.description && exp.description.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 sm:gap-2.5 font-sans text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                              <span className="text-emerald-500 font-mono font-bold mt-0.5 shrink-0">❯</span>
                              <span className="break-words">{bullet}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tech Stack Chips */}
                        {exp.techStack && exp.techStack.length > 0 && (
                          <div className="pt-2">
                            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 sm:mb-2">
                              TECHNOLOGIES USED:
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {exp.techStack.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-mono border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 shadow-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
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
