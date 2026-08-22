import { GitHubStats, ContributionWeek } from "@/types/activity";

const GITHUB_GRAPHQL_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    viewer {
      login
      contributionsCollection(from: $from, to: $to) {
        restrictedContributionsCount
        hasAnyRestrictedContributions
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
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        restrictedContributionsCount
        hasAnyRestrictedContributions
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

    // 2. Compute exact rolling 365-day window in UTC
    const now = new Date();
    const toDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
    const fromDate = new Date(toDate.getTime() - 365 * 24 * 60 * 60 * 1000);
    fromDate.setUTCHours(0, 0, 0, 0);

    // 3. Fetch Contributions via GraphQL API (if GITHUB_TOKEN is configured)
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
            variables: {
              username: cleanUsername,
              from: fromDate.toISOString(),
              to: toDate.toISOString(),
            },
          }),
          next: { revalidate: 3600 },
        });

        if (graphqlRes.ok) {
          const gqlData = await graphqlRes.json();
          const viewer = gqlData?.data?.viewer;
          const user = gqlData?.data?.user;

          // If the authenticated token belongs to this user, prioritize viewer (has complete private repo access)
          if (viewer && viewer.login && viewer.login.toLowerCase() === cleanUsername.toLowerCase()) {
            const viewerCollection = viewer.contributionsCollection;
            const viewerCalendar = viewerCollection?.contributionCalendar;
            const restrictedCount = viewerCollection?.restrictedContributionsCount || 0;

            if (viewerCalendar) {
              weeks = viewerCalendar.weeks || [];
              totalContributions = (viewerCalendar.totalContributions || 0) + restrictedCount;
            }
          } else if (user) {
            const userCollection = user.contributionsCollection;
            const userCalendar = userCollection?.contributionCalendar;
            const restrictedCount = userCollection?.restrictedContributionsCount || 0;

            if (userCalendar) {
              weeks = userCalendar.weeks || [];
              totalContributions = (userCalendar.totalContributions || 0) + restrictedCount;
            }
          }
        }
      } catch (gqlErr) {
        console.warn("GitHub GraphQL fetch error:", gqlErr);
      }
    }

    // 4. Fallback calendar if token unavailable or zero weeks returned
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
