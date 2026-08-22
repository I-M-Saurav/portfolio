"use client";

import React, { useState } from "react";
import { ContributionWeek } from "@/types/activity";
import { LucideIcon } from "lucide-react";

interface ActivityHeatmapProps {
  weeks: ContributionWeek[];
  totalCount: number;
  countLabel: string;
  subLabel?: string;
  icon: LucideIcon;
  theme?: "emerald" | "cyan";
}

export function ActivityHeatmap({
  weeks,
  totalCount,
  countLabel,
  subLabel = "in the last year",
  icon: Icon,
  theme = "emerald",
}: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  const getCellColor = (count: number) => {
    if (count === 0) return "bg-zinc-200 dark:bg-zinc-800/60";

    if (theme === "cyan") {
      if (count <= 2) return "bg-cyan-500/30";
      if (count <= 5) return "bg-cyan-500/60";
      if (count <= 9) return "bg-cyan-500/80";
      return "bg-cyan-400";
    }

    // Default emerald
    if (count <= 2) return "bg-emerald-500/30";
    if (count <= 5) return "bg-emerald-500/60";
    if (count <= 9) return "bg-emerald-500/80";
    return "bg-emerald-400";
  };

  const activeColorText = theme === "cyan" ? "text-cyan-500" : "text-emerald-500";
  const activeTooltipText =
    theme === "cyan" ? "text-cyan-600 dark:text-cyan-400" : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="w-full max-w-full overflow-hidden space-y-2.5">
      {/* Top Count Bar */}
      <div className="flex flex-wrap items-center justify-between font-mono text-xs text-zinc-600 dark:text-zinc-400 gap-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Icon className={`w-3.5 h-3.5 ${activeColorText} shrink-0`} />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {totalCount.toLocaleString()} {countLabel}
          </span>
          <span className="text-[10px] sm:text-[11px] text-zinc-400">{subLabel}</span>
        </div>
        {hoveredDay && (
          <div className={`text-[10px] sm:text-[11px] font-medium animate-fade-in ${activeTooltipText} truncate`}>
            {hoveredDay.count} {countLabel.replace(/s$/, "")}
            {hoveredDay.count !== 1 ? "s" : ""} on {hoveredDay.date}
          </div>
        )}
      </div>

      {/* 52-Week Grid Container */}
      <div className="overflow-x-auto pb-2 no-scrollbar touch-scroll">
        <div className="inline-flex gap-[3px] min-w-full p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/40">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.contributionDays.map((day, dIdx) => (
                <div
                  key={dIdx}
                  onMouseEnter={() => setHoveredDay({ date: day.date, count: day.contributionCount })}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-[10px] h-[10px] rounded-[2px] transition-all hover:scale-125 cursor-pointer ${getCellColor(
                    day.contributionCount
                  )}`}
                  title={`${day.contributionCount} ${countLabel} on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
        <span>52 weeks</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-200 dark:bg-zinc-800/60" />
          <div
            className={`w-2.5 h-2.5 rounded-[2px] ${
              theme === "cyan" ? "bg-cyan-500/30" : "bg-emerald-500/30"
            }`}
          />
          <div
            className={`w-2.5 h-2.5 rounded-[2px] ${
              theme === "cyan" ? "bg-cyan-500/60" : "bg-emerald-500/60"
            }`}
          />
          <div
            className={`w-2.5 h-2.5 rounded-[2px] ${
              theme === "cyan" ? "bg-cyan-500/80" : "bg-emerald-500/80"
            }`}
          />
          <div
            className={`w-2.5 h-2.5 rounded-[2px] ${
              theme === "cyan" ? "bg-cyan-400" : "bg-emerald-400"
            }`}
          />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
