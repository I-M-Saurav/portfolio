"use client";

import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { ProfileDocument, CareerLogDocument, CareerLogType } from "@/types/firestore";
import { siteContent } from "@/lib/content";
import { useToast } from "@/components/ui/toast";
import {
  User,
  Briefcase,
  GraduationCap,
  Trophy,
  Rocket,
  GitCommit,
  Terminal,
  FileCode,
  MapPin,
  Mail,
  Download,
  Copy,
  Check,
} from "lucide-react";

// Fallback data when Firestore is loading or empty
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
  photoUrl: "",
  quickFacts: [
    { key: "degree", value: "B.S. in Computer Science" },
    { key: "year", value: "Class of 2025" },
    { key: "focus", value: "Distributed Systems & Web Performance" },
    { key: "status", value: "Open to Full-time Opportunities" },
  ],
};

const FALLBACK_LOGS: CareerLogDocument[] = [
  {
    id: "1",
    title: "Enrolled in Computer Science",
    description: "Started B.S. in Computer Science focusing on systems and algorithms.",
    date: "Aug 2021",
    type: "education",
    order: 1,
  },
  {
    id: "2",
    title: "Software Engineering Intern @ TechCorp",
    description: "Built scalable internal tooling and microservices using Go and React.",
    date: "May 2023 - Aug 2023",
    type: "work",
    order: 2,
  },
  {
    id: "3",
    title: "1st Place @ University Hackathon",
    description: "Developed an AI-driven collaborative terminal for remote pairing.",
    date: "Nov 2023",
    type: "achievement",
    order: 3,
  },
  {
    id: "4",
    title: "Published Open Source Cache Engine",
    description: "Created high-concurrency in-memory key-value store with zero dependencies.",
    date: "Mar 2024",
    type: "milestone",
    order: 4,
  },
];

// Deterministic short hash generator for git commit IDs
function generateCommitHash(seed: string, index: number): string {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < 7; i++) {
    const code = (seed.charCodeAt(i % seed.length) + index * 17 + i * 31) % chars.length;
    hash += chars[code];
  }
  return hash;
}

// Helper to request high-res, auto-formatted, face-centered images from Cloudinary
function getOptimizedCloudinaryUrl(url?: string, width = 800, height = 800): string {
  if (!url) return "";
  if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
    if (url.includes("/image/upload/c_") || url.includes("/image/upload/w_") || url.includes("/image/upload/q_")) {
      return url;
    }
    return url.replace(
      "/image/upload/",
      `/image/upload/c_fill,g_auto,w_${width},h_${height},q_auto:best,f_auto/`
    );
  }
  return url;
}

interface AboutSectionProps {
  initialProfile?: ProfileDocument;
  initialCareerLogs?: CareerLogDocument[];
}

export function AboutSection({ initialProfile, initialCareerLogs }: AboutSectionProps) {
  const [profile, setProfile] = useState<ProfileDocument>(initialProfile || FALLBACK_PROFILE);
  const [careerLogs, setCareerLogs] = useState<CareerLogDocument[]>(initialCareerLogs || FALLBACK_LOGS);
  const [copied, setCopied] = useState(false);
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
        },
        (err) => {
          console.warn("AboutSection: Profile listener error:", err);
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

  const optimizedPhotoUrl = getOptimizedCloudinaryUrl(profile.photoUrl, 800, 800);

  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 space-y-10 sm:space-y-12 md:space-y-16">
      {/* Section Header (Numbering Removed) */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-zinc-900 dark:text-white tracking-tight">
          About &amp; Career Timeline
        </h2>
        <div className="h-[1px] bg-black/10 dark:bg-white/10 flex-grow ml-4 max-w-md hidden sm:block" />
      </div>

      {/* BLOCK 1: Profile & Biography (about.md) */}
      <div className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Terminal Window Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-200/70 dark:bg-zinc-900/90 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <div className="ml-2 sm:ml-3 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] sm:text-xs">whoami --verbose</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/80 dark:bg-[#18181f] border border-black/10 dark:border-white/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] sm:text-xs font-semibold shadow-sm">
            <FileCode className="w-3.5 h-3.5" />
            <span>about.md</span>
          </div>
        </div>

        {/* Content Container for about.md */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Profile Top Row: Photo + Bio & Metadata */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 md:gap-10">
            {/* Photo / Avatar Frame (240-260px on Desktop, High-DPI optimized) */}
            <div className="relative group shrink-0 self-center md:self-start">
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 lg:w-64 lg:h-64 aspect-square rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-400/40 ring-4 ring-emerald-500/10 dark:ring-emerald-400/10 overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                {optimizedPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={optimizedPhotoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400">
                    <User className="w-16 sm:w-20 h-16 sm:h-20 text-zinc-400 dark:text-zinc-600" />
                    <span className="font-mono text-[10px] sm:text-xs mt-1 text-zinc-500">no_photo.png</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2.5 -right-2.5 px-3 py-1 rounded-md text-[11px] sm:text-xs font-mono font-bold bg-emerald-600 text-white shadow-xl border-2 border-white/20 dark:border-black/40 tracking-wider">
                DEV
              </div>
            </div>

            {/* Header info & Bio */}
            <div className="space-y-3 sm:space-y-4 flex-grow min-w-0 text-center md:text-left">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-zinc-900 dark:text-white break-words tracking-tight">
                  {profile.name}
                </h3>
                <p className="text-xs sm:text-sm md:text-base font-mono text-emerald-600 dark:text-emerald-400 mt-1 break-words font-semibold">
                  {profile.tagline}
                </p>
              </div>

              {profile.location && (
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="break-words">{profile.location}</span>
                </div>
              )}

              <p className="text-xs sm:text-sm md:text-[15px] font-sans text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Quick Facts Terminal Block */}
          <div className="rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40 p-4 sm:p-5 font-mono text-xs overflow-hidden">
            <div className="text-zinc-500 dark:text-zinc-400 mb-2.5 flex items-center gap-2 text-[11px] sm:text-xs">
              <span className="text-emerald-500 font-bold">$</span>
              <span>cat facts.json</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pl-3 border-l-2 border-emerald-500/30">
              {profile.quickFacts && profile.quickFacts.length > 0 ? (
                profile.quickFacts.map((fact, idx) => (
                  <div key={idx} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
                    <span className="text-zinc-500 dark:text-zinc-400 font-semibold shrink-0">{fact.key}:</span>
                    <span className="text-zinc-900 dark:text-zinc-200 break-words">{fact.value}</span>
                  </div>
                ))
              ) : (
                <div className="text-zinc-400 italic text-xs">No quick facts configured.</div>
              )}
            </div>
          </div>

          {/* Email Copy + Resume Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
            {profile.email && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900/80 hover:bg-black/5 dark:hover:bg-white/10 font-mono text-xs text-zinc-800 dark:text-zinc-200 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{profile.email}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 ml-1 shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-400 ml-1 shrink-0" />
                )}
              </button>
            )}

            {profile.resumeUrl && profile.resumeUrl !== "#" && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>Download Resume</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* BLOCK 2: Career Timeline (career.log) */}
      <div className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Terminal Window Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-200/70 dark:bg-zinc-900/90 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <div className="ml-2 sm:ml-3 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] sm:text-xs">git log --stat</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/80 dark:bg-[#18181f] border border-black/10 dark:border-white/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] sm:text-xs font-semibold shadow-sm">
            <GitCommit className="w-3.5 h-3.5" />
            <span>career.log</span>
          </div>
        </div>

        {/* Content Container for career.log */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 font-mono text-xs space-y-6">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 pb-2 border-b border-black/10 dark:border-white/10 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate text-[10px] sm:text-xs">
              <span className="text-emerald-500 font-bold">$</span>
              <span className="truncate">git log --graph --pretty=format:&apos;%h - %cd - %s&apos;</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 shrink-0">{careerLogs.length} commits</span>
          </div>

          {careerLogs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 italic">
              No commits yet — check back soon
            </div>
          ) : (
            <div className="relative pl-5 sm:pl-6 space-y-6 sm:space-y-8 before:absolute before:left-[7px] sm:before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-emerald-500/30">
              {careerLogs.map((log, idx) => {
                const commitHash = generateCommitHash(log.title + (log.id || ""), idx);
                return (
                  <div key={log.id || idx} className="relative group">
                    {/* Git Graph Node Circle */}
                    <div className="absolute -left-[25px] sm:-left-[29px] top-1 w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-white dark:bg-[#111116] border-2 border-emerald-500 flex items-center justify-center shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    </div>

                    {/* Commit Header */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-zinc-500 dark:text-zinc-400">
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">commit</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{commitHash}</span>
                        <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {log.type}
                        </span>
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-500 text-[10px] sm:text-[11px]">
                        Date: <span className="text-zinc-700 dark:text-zinc-300">{log.date}</span>
                      </div>
                    </div>

                    {/* Commit Message & Description Body */}
                    <div className="mt-2.5 sm:mt-3 pl-2.5 sm:pl-3 border-l border-black/10 dark:border-white/10 space-y-1.5">
                      <div className="flex items-start sm:items-center gap-2 text-zinc-900 dark:text-white font-semibold text-xs sm:text-sm">
                        <span className="p-1 rounded bg-black/5 dark:bg-white/5 inline-flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                          {getLogIcon(log.type)}
                        </span>
                        <span className="break-words">{log.title}</span>
                      </div>
                      <p className="text-xs font-sans text-zinc-600 dark:text-zinc-300 pl-0 sm:pl-7 leading-relaxed">
                        {log.description}
                      </p>
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
