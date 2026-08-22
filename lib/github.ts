import { GitHubStats, ContributionWeek } from "@/types/activity";

const GITHUB_GRAPHQL_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

export async function fetchGitHubStats(username?: string): Promise<GitHubStats | null> {
  if (!username || !username.trim()) {
    return null;
  }

  const cleanUsername = username.trim();
  const token = process.env.GITHUB_TOKEN;

  try {
    // 1. Fetch User Profile from REST API
    const userHeaders: HeadersInit = {
      "User-Agent": "Nextjs-Portfolio-App",
      Accept: "application/vnd.github.v3+json",
    };
    if (token) {
      userHeaders.Authorization = `Bearer ${token}`;
    }

    const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, {
      headers: userHeaders,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!userRes.ok) {
      console.warn(`GitHub REST API returned status ${userRes.status} for ${cleanUsername}`);
      return null;
    }

    const userData = await userRes.json();

    let totalContributions = 0;
    let weeks: ContributionWeek[] = [];

    // 2. Fetch Contributions via GraphQL API (if GITHUB_TOKEN is configured)
    if (token) {
      try {
        const graphqlRes = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "Nextjs-Portfolio-App",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: GITHUB_GRAPHQL_QUERY,
            variables: { username: cleanUsername },
          }),
          next: { revalidate: 3600 },
        });

        if (graphqlRes.ok) {
          const gqlData = await graphqlRes.json();
          const calendar = gqlData?.data?.user?.contributionsCollection?.contributionCalendar;
          if (calendar) {
            totalContributions = calendar.totalContributions || 0;
            weeks = calendar.weeks || [];
          }
        }
      } catch (gqlErr) {
        console.warn("GitHub GraphQL fetch error:", gqlErr);
      }
    }

    // 3. Fallback mock calendar if token unavailable or zero weeks returned
    if (weeks.length === 0) {
      weeks = generateFallbackCalendar();
      totalContributions = weeks.reduce(
        (sum, w) => sum + w.contributionDays.reduce((dSum, d) => dSum + d.contributionCount, 0),
        0
      );
    }

    return {
      username: cleanUsername,
      name: userData.name || cleanUsername,
      avatarUrl: userData.avatar_url || "",
      bio: userData.bio || "",
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      htmlUrl: userData.html_url || `https://github.com/${cleanUsername}`,
      totalContributions,
      weeks,
    };
  } catch (error) {
    console.error("fetchGitHubStats error:", error);
    return null;
  }
}

// Generates a 52-week calendar grid structure for clean rendering when GraphQL is restricted
function generateFallbackCalendar(): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  const today = new Date();
  const totalDays = 52 * 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays);

  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + w * 7 + d);
      const dateStr = currentDate.toISOString().split("T")[0] || "";
      days.push({
        date: dateStr,
        contributionCount: 0,
        color: "#161b22",
      });
    }
    weeks.push({ contributionDays: days });
  }

  return weeks;
}
