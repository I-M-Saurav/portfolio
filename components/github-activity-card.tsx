"use client";

import React, { useState } from "react";
import { GitHubStats } from "@/types/activity";
import { Github, GitPullRequest, Users, FolderGit2, ArrowUpRight } from "lucide-react";

interface GitHubActivityCardProps {
  stats: GitHubStats | null;
  username?: string;
}

export function GitHubActivityCard({ stats, username }: GitHubActivityCardProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  if (!username) {
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px] shadow-md">
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
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px] shadow-md">
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

  // Calculate intensity color level based on contribution count
  const getCellColor = (count: number) => {
    if (count === 0) return "bg-zinc-200 dark:bg-zinc-800/60";
    if (count <= 2) return "bg-emerald-500/30";
    if (count <= 5) return "bg-emerald-500/60";
    if (count <= 9) return "bg-emerald-500/80";
    return "bg-emerald-400";
  };

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between">
      {/* Mini Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-200/60 dark:bg-zinc-900/80 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-sm" />
          <span className="ml-2 font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Github className="w-3.5 h-3.5 text-emerald-500" />
            <span>github.com/{stats.username}</span>
          </span>
        </div>
        <a
          href={stats.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-emerald-500 flex items-center gap-1 text-[11px]"
        >
          <span>view profile</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 space-y-6 flex-grow flex flex-col justify-between">
        {/* User Summary Top Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border border-emerald-500/30 overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0">
              {stats.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={stats.avatarUrl} alt={stats.username} className="w-full h-full object-cover" />
              ) : (
                <Github className="w-full h-full p-2 text-zinc-400" />
              )}
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                {stats.name || stats.username}
              </h3>
              <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                @{stats.username}
              </p>
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-2.5 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-zinc-900 dark:text-white">{stats.publicRepos}</span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline">repos</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-bold text-zinc-900 dark:text-white">{stats.followers}</span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline">followers</span>
            </div>
          </div>
        </div>

        {/* Contribution Heatmap Container */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <GitPullRequest className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold">
                {stats.totalContributions.toLocaleString()} contributions
              </span>
              <span className="text-[11px] text-zinc-400">in the last year</span>
            </div>
            {hoveredDay && (
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 animate-fade-in font-medium">
                {hoveredDay.count} contribution{hoveredDay.count !== 1 ? "s" : ""} on {hoveredDay.date}
              </div>
            )}
          </div>

          {/* Heatmap Grid - 52 columns x 7 rows */}
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <div className="inline-flex gap-[3px] min-w-full p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40">
              {stats.weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.contributionDays.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onMouseEnter={() => setHoveredDay({ date: day.date, count: day.contributionCount })}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-[10px] h-[10px] rounded-[2px] transition-all hover:scale-125 cursor-pointer ${getCellColor(
                        day.contributionCount
                      )}`}
                      title={`${day.contributionCount} contributions on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
            <span>52 weeks</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-200 dark:bg-zinc-800/60" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/30" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/60" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/80" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
