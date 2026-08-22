"use client";

import React, { useEffect, useState } from "react";
import { doc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { ProfileDocument, CareerLogDocument, CareerLogType } from "@/types/firestore";
import { siteContent } from "@/lib/content";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode,
  GitCommit,
  MapPin,
  Mail,
  Copy,
  Check,
  Download,
  GraduationCap,
  Briefcase,
  Trophy,
  Rocket,
  Terminal,
  User,
} from "lucide-react";
import { useToast } from "./ui/toast";

const FALLBACK_PROFILE: ProfileDocument = {
  name: siteContent.name,
  tagline: siteContent.identity,
  location: "San Francisco, CA / Remote",
  bio: siteContent.bio,
  email: "alex.developer@example.com",
  degree: "B.S. in Computer Science",
  year: "Class of 2025",
  focus: "Distributed Systems & Web Performance",
  resumeUrl: "#",
  quickFacts: [
    { key: "degree", value: "B.S. in Computer Science" },
    { key: "year", value: "Class of 2025" },
    { key: "focus", value: "Distributed Systems & Modern Web" },
    { key: "interests", value: "Cloud Infrastructure, Compilers, UI Engineering" },
  ],
};

const FALLBACK_LOGS: CareerLogDocument[] = [
  {
    id: "1",
    date: "Aug 2026",
    type: "work",
    title: "Software Engineering Intern @ CloudScale Systems",
    description: "Architected real-time streaming pipelines processing 2M+ events/min with Node.js and Kafka.",
    order: 1,
  },
  {
    id: "2",
    date: "Jan 2026",
    type: "achievement",
    title: "Winner @ Global Open Source Hackathon",
    description: "Built an AI-assisted terminal developer copilot with 1.2k+ GitHub stars in the first month.",
    order: 2,
  },
  {
    id: "3",
    date: "Aug 2025",
    type: "milestone",
    title: "Lead Frontend Architect @ TechClub University",
    description: "Spearheaded university portal revamp serving 15,000+ active students.",
    order: 3,
  },
  {
    id: "4",
    date: "Sep 2023",
    type: "education",
    title: "Enrolled in B.S. Computer Science",
    description: "Specialization in Systems and Algorithms. Dean's Honors List.",
    order: 4,
  },
];

// Helper to generate deterministic short commit hashes from string id/title
function generateCommitHash(seed: string, index: number): string {
  const hashChars = "abcdef0123456789";
  let hash = "";
  for (let i = 0; i < 7; i++) {
    const code = (seed.charCodeAt(i % seed.length) + index * 7 + i * 13) % hashChars.length;
    hash += hashChars[code];
  }
  return hash;
}

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<"about.md" | "career.log">("about.md");
  const [profile, setProfile] = useState<ProfileDocument>(FALLBACK_PROFILE);
  const [careerLogs, setCareerLogs] = useState<CareerLogDocument[]>(FALLBACK_LOGS);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribeProfile = () => {};
    let unsubscribeCareer = () => {};

    try {
      const db = getFirebaseDb();

      // 1. Live listener for Profile Document
      const profileDocRef = doc(db, "profile", "main");
      unsubscribeProfile = onSnapshot(
        profileDocRef,
        (snap) => {
          if (snap.exists()) {
            setProfile(snap.data() as ProfileDocument);
          }
          setLoading(false);
        },
        (err) => {
          console.warn("AboutSection: Profile listener error:", err);
          setLoading(false);
        }
      );

      // 2. Live listener for Career Logs
      const careerQuery = query(collection(db, "careerLog"), orderBy("order", "asc"));
      unsubscribeCareer = onSnapshot(
        careerQuery,
        (snap) => {
          if (!snap.empty) {
            const logs: CareerLogDocument[] = [];
            snap.forEach((docSnap) => {
              logs.push({ id: docSnap.id, ...(docSnap.data() as Omit<CareerLogDocument, "id">) });
            });
            setCareerLogs(logs);
          }
        },
        (err) => {
          console.warn("AboutSection: Career logs listener error:", err);
        }
      );
    } catch (err) {
      console.warn("AboutSection: Firestore init error:", err);
      setLoading(false);
    }

    return () => {
      unsubscribeProfile();
      unsubscribeCareer();
    };
  }, []);

  const handleCopyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast(`Copied ${profile.email} to clipboard`, "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy email to clipboard", "error");
    }
  };

  const getLogIcon = (type: CareerLogType) => {
    switch (type) {
      case "education":
        return <GraduationCap className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />;
      case "work":
        return <Briefcase className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
      case "achievement":
        return <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case "milestone":
        return <Rocket className="w-4 h-4 text-purple-500 dark:text-purple-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="font-mono text-emerald-600 dark:text-emerald-400 text-lg font-bold">01.</span>
        <h2 className="text-xl sm:text-2xl font-mono font-bold text-zinc-900 dark:text-white tracking-tight">
          About & Career Timeline
        </h2>
        <div className="h-[1px] bg-black/10 dark:bg-white/10 flex-grow ml-4 max-w-md hidden sm:block" />
      </div>

      {/* Terminal Window Card */}
      <div className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Top Window Bar + Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-200/70 dark:bg-zinc-900/90 border-b border-black/10 dark:border-white/10 px-4 pt-3 sm:pb-0 gap-2">
          {/* Decorative Window Controls & Label */}
          <div className="flex items-center gap-2 pb-2 sm:pb-3">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <span className="ml-3 font-mono text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span>profile_viewer</span>
            </span>
          </div>

          {/* Clickable Code Editor Tabs */}
          <div className="flex items-center gap-1 sm:self-end">
            <button
              type="button"
              onClick={() => setActiveTab("about.md")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-t-lg transition-all border-t border-x ${
                activeTab === "about.md"
                  ? "bg-white/90 dark:bg-[#111116] text-emerald-600 dark:text-emerald-400 border-black/10 dark:border-white/10 font-semibold shadow-sm"
                  : "bg-transparent text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>about.md</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("career.log")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-t-lg transition-all border-t border-x ${
                activeTab === "career.log"
                  ? "bg-white/90 dark:bg-[#111116] text-emerald-600 dark:text-emerald-400 border-black/10 dark:border-white/10 font-semibold shadow-sm"
                  : "bg-transparent text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>career.log</span>
            </button>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 md:p-10 min-h-[380px]">
          <AnimatePresence mode="wait">
            {activeTab === "about.md" ? (
              <motion.div
                key="about-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* Profile Top Row: Photo + Bio & Metadata */}
                <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                  {/* Photo / Avatar Frame */}
                  <div className="relative group shrink-0">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-400/30 overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-lg">
                      {profile.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.photoUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-400">
                          <User className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
                          <span className="font-mono text-[10px] mt-1 text-zinc-500">no_photo.png</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-600 text-white shadow">
                      DEV
                    </div>
                  </div>

                  {/* Header info */}
                  <div className="space-y-3 flex-grow">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-white">
                        {profile.name}
                      </h3>
                      <p className="text-sm font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                        {profile.tagline}
                      </p>
                    </div>

                    {profile.location && (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{profile.location}</span>
                      </div>
                    )}

                    <p className="text-sm font-sans text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1">
                      {profile.bio}
                    </p>
                  </div>
                </div>

                {/* Quick Facts Terminal Block */}
                <div className="rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40 p-5 font-mono text-xs">
                  <div className="text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">$</span>
                    <span>cat facts.json</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-3 border-l-2 border-emerald-500/30">
                    {profile.quickFacts && profile.quickFacts.length > 0 ? (
                      profile.quickFacts.map((fact, idx) => (
                        <div key={idx} className="flex items-baseline gap-2">
                          <span className="text-zinc-500 dark:text-zinc-400 font-semibold">{fact.key}:</span>
                          <span className="text-zinc-900 dark:text-zinc-200">{fact.value}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-400 italic">No quick facts configured.</div>
                    )}
                  </div>
                </div>

                {/* Email Copy + Resume Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {profile.email && (
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900/80 hover:bg-black/5 dark:hover:bg-white/10 font-mono text-xs text-zinc-800 dark:text-zinc-200 transition-all active:scale-[0.98] shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{profile.email}</span>
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 ml-1" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-400 ml-1" />
                      )}
                    </button>
                  )}

                  {profile.resumeUrl && profile.resumeUrl !== "#" && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resume</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="career-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="font-mono text-xs space-y-6"
              >
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 pb-2 border-b border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">$</span>
                    <span>git log --graph --pretty=format:&apos;%h - %cd - %s&apos;</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">{careerLogs.length} commits</span>
                </div>

                {careerLogs.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 italic">
                    No commits yet — check back soon
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-emerald-500/30">
                    {careerLogs.map((log, idx) => {
                      const commitHash = generateCommitHash(log.title + (log.id || ""), idx);
                      return (
                        <div key={log.id || idx} className="relative group">
                          {/* Git Graph Node Circle */}
                          <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-white dark:bg-[#111116] border-2 border-emerald-500 flex items-center justify-center shadow">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          </div>

                          {/* Commit Header */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">commit</span>
                              <span className="text-emerald-600 dark:text-emerald-400">{commitHash}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                {log.type}
                              </span>
                            </div>
                            <div className="text-zinc-500 dark:text-zinc-500 text-[11px]">
                              Date: <span className="text-zinc-700 dark:text-zinc-300">{log.date}</span>
                            </div>
                          </div>

                          {/* Commit Message & Description Body */}
                          <div className="mt-3 pl-3 border-l border-black/10 dark:border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold text-sm">
                              <span className="p-1 rounded bg-black/5 dark:bg-white/5 inline-flex items-center justify-center">
                                {getLogIcon(log.type)}
                              </span>
                              <span>{log.title}</span>
                            </div>
                            <p className="text-xs font-sans text-zinc-600 dark:text-zinc-300 pl-7 leading-relaxed">
                              {log.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
