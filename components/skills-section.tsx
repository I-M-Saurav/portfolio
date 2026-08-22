"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { SkillDocument, SkillCategory } from "@/types/firestore";
import { Cpu, Layers } from "lucide-react";

const CATEGORIES: SkillCategory[] = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "DevOps",
  "Cloud",
  "Tools",
];

const FALLBACK_SKILLS: SkillDocument[] = [
  // Languages
  { id: "1", name: "TypeScript", category: "Languages", proficiency: 92, order: 1 },
  { id: "2", name: "JavaScript (ES6+)", category: "Languages", proficiency: 95, order: 2 },
  { id: "3", name: "Python", category: "Languages", proficiency: 85, order: 3 },
  { id: "4", name: "Go (Golang)", category: "Languages", proficiency: 75, order: 4 },
  { id: "5", name: "C++", category: "Languages", proficiency: 70, order: 5 },
  { id: "6", name: "SQL", category: "Languages", proficiency: 88, order: 6 },

  // Frontend
  { id: "7", name: "React 18 / 19", category: "Frontend", proficiency: 95, order: 1 },
  { id: "8", name: "Next.js (App Router)", category: "Frontend", proficiency: 90, order: 2 },
  { id: "9", name: "Tailwind CSS", category: "Frontend", proficiency: 95, order: 3 },
  { id: "10", name: "Framer Motion", category: "Frontend", proficiency: 85, order: 4 },
  { id: "11", name: "HTML5 / Canvas", category: "Frontend", proficiency: 90, order: 5 },

  // Backend
  { id: "12", name: "Node.js / Express", category: "Backend", proficiency: 90, order: 1 },
  { id: "13", name: "NestJS", category: "Backend", proficiency: 80, order: 2 },
  { id: "14", name: "GraphQL APIs", category: "Backend", proficiency: 85, order: 3 },
  { id: "15", name: "RESTful Architecture", category: "Backend", proficiency: 95, order: 4 },
  { id: "16", name: "gRPC", category: "Backend", proficiency: 72, order: 5 },

  // Databases
  { id: "17", name: "PostgreSQL", category: "Databases", proficiency: 90, order: 1 },
  { id: "18", name: "Firestore / Firebase", category: "Databases", proficiency: 88, order: 2 },
  { id: "19", name: "Redis", category: "Databases", proficiency: 82, order: 3 },
  { id: "20", name: "MongoDB", category: "Databases", proficiency: 80, order: 4 },

  // DevOps & Cloud & Tools
  { id: "21", name: "Docker & Containers", category: "DevOps", proficiency: 85, order: 1 },
  { id: "22", name: "CI/CD (GitHub Actions)", category: "DevOps", proficiency: 88, order: 2 },
  { id: "23", name: "Kubernetes (K8s)", category: "DevOps", proficiency: 70, order: 3 },
  { id: "24", name: "AWS (S3, Lambda, EC2)", category: "Cloud", proficiency: 80, order: 1 },
  { id: "25", name: "Vercel / Cloudflare", category: "Cloud", proficiency: 90, order: 2 },
  { id: "26", name: "Git & Version Control", category: "Tools", proficiency: 95, order: 1 },
  { id: "27", name: "Postman / Bruno", category: "Tools", proficiency: 90, order: 2 },
  { id: "28", name: "Linux / Shell Scripting", category: "Tools", proficiency: 85, order: 3 },
];

interface SkillsSectionProps {
  initialSkills?: SkillDocument[];
}

export function SkillsSection({ initialSkills }: SkillsSectionProps) {
  const [skills, setSkills] = useState<SkillDocument[]>(
    initialSkills && initialSkills.length > 0 ? initialSkills : FALLBACK_SKILLS
  );

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const db = getFirebaseDb();
      const skillsQuery = query(collection(db, "skills"), orderBy("order", "asc"));
      unsubscribe = onSnapshot(
        skillsQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: SkillDocument[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...(docSnap.data() as Omit<SkillDocument, "id">) });
            });
            setSkills(list);
          }
        },
        (err) => {
          console.warn("SkillsSection: onSnapshot error:", err);
        }
      );
    } catch (err) {
      console.warn("SkillsSection: initialization error:", err);
    }

    return () => unsubscribe();
  }, []);

  // Group skills by category
  const skillsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills
      .filter((s) => s.category === cat)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    return acc;
  }, {} as Record<SkillCategory, SkillDocument[]>);

  return (
    <section id="skills" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="font-mono text-emerald-600 dark:text-emerald-400 text-lg font-bold">02.</span>
        <h2 className="text-xl sm:text-2xl font-mono font-bold text-zinc-900 dark:text-white tracking-tight">
          Technical Arsenal & Skills
        </h2>
        <div className="h-[1px] bg-black/10 dark:bg-white/10 flex-grow ml-4 max-w-md hidden sm:block" />
      </div>

      {/* Terminal Window Card */}
      <div className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Terminal Top Window Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-200/70 dark:bg-zinc-900/90 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <div className="ml-3 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              <span>neofetch --skills</span>
            </div>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
            {skills.length} modules loaded
          </div>
        </div>

        {/* Skills Content Area */}
        <div className="p-6 md:p-10 space-y-8">
          {skills.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 font-mono text-xs">
              Skills loading... configure skills via /admin panel
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {CATEGORIES.map((cat) => {
                const categorySkills = skillsByCategory[cat];
                if (!categorySkills || categorySkills.length === 0) return null;

                return (
                  <div
                    key={cat}
                    className="p-5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/30 space-y-3"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                        <Layers className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{cat}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        [{categorySkills.length}]
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill.id || skill.name}
                          className="group relative overflow-hidden px-3 py-1.5 rounded-lg text-xs font-mono border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm"
                        >
                          {/* Optional Proficiency Fill Background */}
                          {typeof skill.proficiency === "number" && skill.proficiency > 0 && (
                            <div
                              className="absolute bottom-0 left-0 h-[2px] bg-emerald-500/70 group-hover:bg-emerald-400 transition-all"
                              style={{ width: `${skill.proficiency}%` }}
                              title={`Proficiency: ${skill.proficiency}%`}
                            />
                          )}
                          <div className="flex items-center gap-1.5">
                            <span>{skill.name}</span>
                            {typeof skill.proficiency === "number" && skill.proficiency > 0 && (
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 opacity-60 group-hover:opacity-100">
                                {skill.proficiency}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
