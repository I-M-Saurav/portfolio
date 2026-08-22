"use client";

import React from "react";
import { GitHubStats, CodeforcesStats } from "@/types/activity";
import { GitHubActivityCard } from "./github-activity-card";
import { CodeforcesActivityCard } from "./codeforces-activity-card";
import { Terminal, Activity } from "lucide-react";

interface ActivitySectionProps {
  githubStats: GitHubStats | null;
  githubUsername?: string;
  codeforcesStats: CodeforcesStats | null;
  codeforcesHandle?: string;
}

export function ActivitySection({
  githubStats,
  githubUsername,
  codeforcesStats,
  codeforcesHandle,
}: ActivitySectionProps) {
  return (
    <section id="activity" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="font-mono text-emerald-600 dark:text-emerald-400 text-lg font-bold">04.</span>
        <h2 className="text-xl sm:text-2xl font-mono font-bold text-zinc-900 dark:text-white tracking-tight">
          Coding Activity &amp; Stats
        </h2>
        <div className="h-[1px] bg-black/10 dark:bg-white/10 flex-grow ml-4 max-w-md hidden sm:block" />
      </div>

      {/* Terminal Window Card Container */}
      <div className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Terminal Top Window Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-200/70 dark:bg-zinc-900/90 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <div className="ml-3 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>activity --stats</span>
            </div>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
            live telemetry
          </div>
        </div>

        {/* Content: Side-by-side Grid on Desktop, Stacked on Mobile */}
        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GitHubActivityCard stats={githubStats} username={githubUsername} />
          <CodeforcesActivityCard stats={codeforcesStats} handle={codeforcesHandle} />
        </div>
      </div>
    </section>
  );
}
