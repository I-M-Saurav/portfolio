"use client";

import React from "react";
import { CodeforcesStats } from "@/types/activity";
import { getCodeforcesRankColor } from "@/lib/codeforces";
import { Code2, Award, CheckCircle2, TrendingUp, ArrowUpRight, Flame } from "lucide-react";
import { ActivityHeatmap } from "./activity-heatmap";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface CodeforcesActivityCardProps {
  stats: CodeforcesStats | null;
  handle?: string;
}

export function CodeforcesActivityCard({ stats, handle }: CodeforcesActivityCardProps) {
  if (!handle) {
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[360px] shadow-md">
        <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400">
          <Code2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
            Codeforces not connected yet
          </h4>
          <p className="font-mono text-xs text-zinc-500 mt-1 max-w-xs">
            Add your Codeforces handle in the /admin profile settings to showcase competitive programming rating &amp; submission activity.
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[360px] shadow-md">
        <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400">
          <Code2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
            Unable to load Codeforces stats
          </h4>
          <p className="font-mono text-xs text-zinc-500 mt-1 max-w-xs">
            Verify handle &apos;{handle}&apos; or check Codeforces API status.
          </p>
        </div>
      </div>
    );
  }

  const rankStyle = getCodeforcesRankColor(stats.rank);

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between">
      {/* Mini Window Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-200/60 dark:bg-zinc-900/80 border-b border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500 dark:text-zinc-400 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-sm shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-sm shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-sm shrink-0" />
          <span className="ml-1.5 sm:ml-2 font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 truncate text-[11px] sm:text-xs">
            <Code2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span className="truncate">codeforces.com/profile/{stats.handle}</span>
          </span>
        </div>
        <a
          href={`https://codeforces.com/profile/${stats.handle}`}
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-cyan-500/30 overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 flex items-center justify-center">
              {stats.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={stats.avatar} alt={stats.handle} className="w-full h-full object-cover" />
              ) : (
                <Code2 className="w-6 h-6 text-zinc-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="font-mono text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
                  {stats.handle}
                </h3>
                {stats.rank && (
                  <span
                    className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-semibold capitalize shrink-0"
                    style={{
                      color: rankStyle.color,
                      backgroundColor: rankStyle.badgeBg,
                      border: `1px solid ${rankStyle.badgeBorder}`,
                    }}
                  >
                    {stats.rank}
                  </span>
                )}
              </div>
              <p className="font-mono text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {stats.organization || "Competitive Programmer"}
              </p>
            </div>
          </div>

          {/* Stat Badges */}
          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <div className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 shrink-0" style={{ color: rankStyle.color }} />
              <span className="font-bold text-zinc-900 dark:text-white">{stats.rating || "Unrated"}</span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline">(max: {stats.maxRating || "N/A"})</span>
            </div>
            <div className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="font-bold text-zinc-900 dark:text-white">{stats.totalSolved}</span>
              <span className="text-[10px] text-zinc-400">solved</span>
            </div>
          </div>
        </div>

        {/* Codeforces Submission Activity Heatmap */}
        {stats.weeks && stats.weeks.length > 0 && (
          <ActivityHeatmap
            weeks={stats.weeks}
            totalCount={stats.totalSubmissions}
            countLabel="submissions"
            subLabel="in the last year"
            icon={Flame}
            theme="cyan"
          />
        )}

        {/* Rating History Chart */}
        <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-semibold text-[11px] sm:text-xs">Rating Progression History</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400">{stats.ratingHistory.length} contests</span>
          </div>

          <div className="h-32 sm:h-36 w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40 p-1.5 sm:p-2">
            {stats.ratingHistory && stats.ratingHistory.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.ratingHistory} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="date"
                    stroke="#71717a"
                    fontSize={10}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={10}
                    tickLine={false}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111116",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontFamily: "monospace",
                    }}
                    labelStyle={{ color: "#a1a1aa" }}
                    itemStyle={{ color: "#06b6d4" }}
                    formatter={(value: any) => [`${value} pts`, "Rating"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke={rankStyle.color}
                    strokeWidth={2}
                    dot={{ r: 2, fill: rankStyle.color }}
                    activeDot={{ r: 5, stroke: "#ffffff", strokeWidth: 1 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-xs text-zinc-500">
                Participate in more contests to generate graph
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
