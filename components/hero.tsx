"use client";

import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { ProfileDocument } from "@/types/firestore";
import { siteContent } from "@/lib/content";
import { ArrowUpRight, Mail, Terminal } from "lucide-react";

export function Hero() {
  const [profile, setProfile] = useState<Partial<ProfileDocument>>({
    name: siteContent.name,
    tagline: siteContent.identity,
    bio: siteContent.bio,
  });

  useEffect(() => {
    try {
      const db = getFirebaseDb();
      const profileDocRef = doc(db, "profile", "main");
      const unsubscribe = onSnapshot(
        profileDocRef,
        (snap) => {
          if (snap.exists()) {
            setProfile(snap.data() as ProfileDocument);
          }
        },
        (error) => {
          console.warn("Hero: Firestore profile listener error, falling back to static config:", error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn("Hero: Firestore initialization error:", err);
    }
  }, []);

  const displayName = profile.name || siteContent.name;
  const displayIdentity = profile.tagline || siteContent.identity;
  const displayBio = profile.bio || siteContent.bio;
  const displayStatus = siteContent.status;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-16 md:pb-24">
      {/* Terminal Window Card */}
      <div className="w-full max-w-4xl mx-auto rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden transition-all">
        {/* Terminal Top Window Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-200/60 dark:bg-zinc-900/80 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <div className="ml-3 hidden sm:flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span>bash - 80x24</span>
            </div>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 font-mono tracking-tight text-[11px] sm:text-xs">
            {siteContent.terminalPromptUser}
          </div>
        </div>

        {/* Terminal Window Content */}
        <div className="p-6 md:p-8 font-mono text-xs sm:text-sm space-y-6 text-zinc-800 dark:text-zinc-200 leading-relaxed">
          {/* $ whoami command */}
          <div>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">$</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold">whoami</span>
            </div>
            <div className="mt-2 pl-4 border-l-2 border-emerald-500/40 dark:border-emerald-400/30">
              <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                {displayName}
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
                {displayIdentity}
              </p>
            </div>
          </div>

          {/* $ cat focus.txt command */}
          <div>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">$</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold">cat focus.txt</span>
            </div>
            <div className="mt-2 pl-4 border-l-2 border-emerald-500/40 dark:border-emerald-400/30">
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
                {displayBio}
              </p>
            </div>
          </div>

          {/* Status Line */}
          <div className="pt-1">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 inline-block" />
              {displayStatus}
            </span>
          </div>

          {/* Closing Prompt with Blinking Cursor */}
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 pt-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">$</span>
            <span className="inline-block w-2.5 h-4 bg-emerald-500 dark:bg-emerald-400 animate-cursor-blink" />
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
        <a
          href={siteContent.cta.exploreProjects.href}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all duration-150 active:scale-[0.98]"
        >
          <span>{siteContent.cta.exploreProjects.text}</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
        <a
          href={siteContent.cta.getInTouch.href}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-semibold border border-black/15 dark:border-white/15 bg-white/40 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 transition-all duration-150 active:scale-[0.98]"
        >
          <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{siteContent.cta.getInTouch.text}</span>
        </a>
      </div>

      {/* Core Technologies Section */}
      <div className="w-full max-w-4xl mx-auto mt-12 pt-8 border-t border-black/10 dark:border-white/10">
        <h2 className="font-mono text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mb-4">
          CORE TECHNOLOGIES
        </h2>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {siteContent.coreTechnologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-150 shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
