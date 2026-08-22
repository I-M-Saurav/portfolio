"use client";

import React from "react";
import { GitHubStats } from "@/types/activity";
import { Github, GitPullRequest, Users, FolderGit2, ArrowUpRight } from "lucide-react";
import { ActivityHeatmap } from "./activity-heatmap";

interface GitHubActivityCardProps {
  stats: GitHubStats | null;
  username?: string;
}

export function GitHubActivityCard({ stats, username }: GitHubActivityCardProps) {
  if (!username) {
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[360px] shadow-md">
        <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400">
          <Github className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
            GitHub not connected yet
          </h4>
          <p className="font-mono text-xs text-zinc-500 mt-1 max-w-xs">
            Add your GitHub username in the /admin profile settings to showcase repositories &amp; contribution heatmap.
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[360px] shadow-md">
        <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400">
          <Github className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
            Unable to load GitHub stats
          </h4>
          <p className="font-mono text-xs text-zinc-500 mt-1 max-w-xs">
            Verify username &apos;{username}&apos; or check GitHub API status.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between">
      {/* Mini Window Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-200/60 dark:bg-zinc-900/80 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-sm shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-sm shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-sm shrink-0" />
          <span className="ml-1.5 sm:ml-2 font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 truncate text-[11px] sm:text-xs">
            <Github className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">github.com/{stats.username}</span>
          </span>
        </div>
        <a
          href={stats.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-emerald-500 flex items-center gap-1 text-[10px] sm:text-[11px] shrink-0 font-medium"
        >
          <span>view profile</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6 flex-grow flex flex-col justify-between">
        {/* User Summary Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-emerald-500/30 overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 flex items-center justify-center">
              {stats.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={stats.avatarUrl} alt={stats.username} className="w-full h-full object-cover" />
              ) : (
                <Github className="w-full h-full p-2 text-zinc-400" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-mono text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
                {stats.name || stats.username}
              </h3>
              <p className="font-mono text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">
                @{stats.username}
              </p>
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <div className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="font-bold text-zinc-900 dark:text-white">{stats.publicRepos}</span>
              <span className="text-[10px] text-zinc-400">repos</span>
            </div>
            <div className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span className="font-bold text-zinc-900 dark:text-white">{stats.followers}</span>
              <span className="text-[10px] text-zinc-400">followers</span>
            </div>
          </div>
        </div>

        {/* Contribution Heatmap */}
        <ActivityHeatmap
          weeks={stats.weeks}
          totalCount={stats.totalContributions}
          countLabel="contributions"
          subLabel="in the last year"
          icon={GitPullRequest}
          theme="emerald"
        />
      </div>
    </div>
  );
}
