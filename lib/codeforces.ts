import { CodeforcesStats, CodeforcesRatingChange, ContributionWeek } from "@/types/activity";

export function getCodeforcesRankColor(rank?: string): {
  color: string;
  badgeBg: string;
  badgeBorder: string;
} {
  const r = (rank || "").toLowerCase();

  if (r.includes("legendary") || r.includes("international grandmaster") || r.includes("grandmaster")) {
    return { color: "#ef4444", badgeBg: "rgba(239, 68, 68, 0.15)", badgeBorder: "rgba(239, 68, 68, 0.3)" }; // Red
  }
  if (r.includes("international master") || r.includes("master")) {
    return { color: "#f97316", badgeBg: "rgba(249, 115, 22, 0.15)", badgeBorder: "rgba(249, 115, 22, 0.3)" }; // Orange
  }
  if (r.includes("candidate master")) {
    return { color: "#a855f7", badgeBg: "rgba(168, 85, 247, 0.15)", badgeBorder: "rgba(168, 85, 247, 0.3)" }; // Purple
  }
  if (r.includes("expert")) {
    return { color: "#3b82f6", badgeBg: "rgba(59, 130, 246, 0.15)", badgeBorder: "rgba(59, 130, 246, 0.3)" }; // Blue
  }
  if (r.includes("specialist")) {
    return { color: "#06b6d4", badgeBg: "rgba(6, 182, 212, 0.15)", badgeBorder: "rgba(6, 182, 212, 0.3)" }; // Cyan
  }
  if (r.includes("pupil")) {
    return { color: "#10b981", badgeBg: "rgba(16, 185, 129, 0.15)", badgeBorder: "rgba(16, 185, 129, 0.3)" }; // Green
  }
  if (r.includes("newbie")) {
    return { color: "#9ca3af", badgeBg: "rgba(156, 163, 175, 0.15)", badgeBorder: "rgba(156, 163, 175, 0.3)" }; // Gray
  }
  return { color: "#06b6d4", badgeBg: "rgba(6, 182, 212, 0.15)", badgeBorder: "rgba(6, 182, 212, 0.3)" };
}

export async function fetchCodeforcesStats(handle?: string): Promise<CodeforcesStats | null> {
  if (!handle || !handle.trim()) {
    return null;
  }

  const cleanHandle = handle.trim();

  try {
    // 1. Fetch User Info
    const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${cleanHandle}`, {
      next: { revalidate: 3600 },
    });

    if (!userRes.ok) {
      console.warn(`Codeforces API user.info error: status ${userRes.status}`);
      return null;
    }

    const userData = await userRes.json();
    if (userData.status !== "OK" || !userData.result?.[0]) {
      return null;
    }

    const user = userData.result[0];

    // 2. Fetch User Submissions to compute unique solved problems and daily submission counts
    let totalSolved = 0;
    let totalSubmissionsLastYear = 0;
    const dailySubmissionMap: Record<string, number> = {};

    try {
      const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${cleanHandle}`, {
        next: { revalidate: 3600 },
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.status === "OK" && Array.isArray(statusData.result)) {
          const solvedSet = new Set<string>();

          statusData.result.forEach((sub: any) => {
            if (sub.verdict === "OK" && sub.problem) {
              const key = `${sub.problem.contestId}-${sub.problem.index}`;
              solvedSet.add(key);
            }

            if (sub.creationTimeSeconds) {
              const subDate = new Date(sub.creationTimeSeconds * 1000);
              const dateStr = subDate.toISOString().split("T")[0];
              dailySubmissionMap[dateStr] = (dailySubmissionMap[dateStr] || 0) + 1;
            }
          });

          totalSolved = solvedSet.size;
        }
      }
    } catch (statusErr) {
      console.warn("Codeforces user.status error:", statusErr);
    }

    // 3. Build 52-week submission calendar grid
    const weeks: ContributionWeek[] = [];
    const now = new Date();
    // Find the end date (Saturday of current week or today)
    const toDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const dayOfWeek = toDate.getUTCDay(); // 0 = Sunday, 6 = Saturday
    const daysToSaturday = 6 - dayOfWeek;
    const endCalendarDate = new Date(toDate.getTime() + daysToSaturday * 24 * 60 * 60 * 1000);

    // 52 weeks * 7 days = 364 days back from endCalendarDate
    const startCalendarDate = new Date(endCalendarDate.getTime() - (52 * 7 - 1) * 24 * 60 * 60 * 1000);

    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const currentDay = new Date(startCalendarDate.getTime() + (w * 7 + d) * 24 * 60 * 60 * 1000);
        const dateKey = currentDay.toISOString().split("T")[0];
        const count = dailySubmissionMap[dateKey] || 0;
        if (currentDay <= toDate) {
          totalSubmissionsLastYear += count;
        }
        days.push({
          date: dateKey,
          contributionCount: count,
          color: count > 0 ? "#06b6d4" : "#161b22",
        });
      }
      weeks.push({ contributionDays: days });
    }

    // 4. Fetch Rating History
    const ratingHistory: { contest: string; rating: number; date: string }[] = [];
    try {
      const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${cleanHandle}`, {
        next: { revalidate: 3600 },
      });
      if (ratingRes.ok) {
        const ratingData = await ratingRes.json();
        if (ratingData.status === "OK" && Array.isArray(ratingData.result)) {
          ratingData.result.forEach((change: CodeforcesRatingChange) => {
            const dateObj = new Date(change.ratingUpdateTimeSeconds * 1000);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            ratingHistory.push({
              contest: change.contestName,
              rating: change.newRating,
              date: `${monthNames[dateObj.getMonth()]} '${String(dateObj.getFullYear()).slice(2)}`,
            });
          });
        }
      }
    } catch (ratingErr) {
      console.warn("Codeforces user.rating error:", ratingErr);
    }

    return {
      handle: user.handle,
      rating: user.rating,
      maxRating: user.maxRating,
      rank: user.rank,
      maxRank: user.maxRank,
      avatar: user.titlePhoto || user.avatar || "",
      organization: user.organization || "",
      totalSolved,
      totalSubmissions: totalSubmissionsLastYear,
      weeks,
      ratingHistory,
    };
  } catch (error) {
    console.error("fetchCodeforcesStats error:", error);
    return null;
  }
}
