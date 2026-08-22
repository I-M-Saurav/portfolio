import { GitHubStats, ContributionWeek } from "@/types/activity";

const GITHUB_GRAPHQL_QUERY = `
  query($username: String!) {
    viewer {
      login
      repositories(ownerAffiliations: OWNER) {
        totalCount
      }
      allAffiliated: repositories(affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
        totalCount
      }
      contributionsCollection {
        restrictedContributionsCount
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
      repositories(ownerAffiliations: OWNER) {
        totalCount
      }
      allAffiliated: repositories(affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
        totalCount
      }
      contributionsCollection {
        restrictedContributionsCount
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

    let userData: any = null;
    if (token) {
      try {
        const authUserRes = await fetch("https://api.github.com/user", {
          headers: userHeaders,
          next: { revalidate: 3600 },
        });
        if (authUserRes.ok) {
          const authUser = await authUserRes.json();
          if (authUser.login?.toLowerCase() === cleanUsername.toLowerCase()) {
            userData = authUser;
          }
        }
      } catch (authErr) {
        console.warn("Failed to fetch /user:", authErr);
      }
    }

    if (!userData) {
      const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, {
        headers: userHeaders,
        next: { revalidate: 3600 },
      });

      if (!userRes.ok) {
        console.warn(`GitHub REST API returned status ${userRes.status} for ${cleanUsername}`);
        return null;
      }

      userData = await userRes.json();
    }

    let totalContributions = 0;
    let weeks: ContributionWeek[] = [];
    let totalRepos =
      (userData.public_repos || 0) +
      (userData.total_private_repos || userData.owned_private_repos || 0);

    // 2. Fetch Contributions & Repository counts via GraphQL API
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
            },
          }),
          next: { revalidate: 3600 },
        });

        if (graphqlRes.ok) {
          const gqlData = await graphqlRes.json();
          const viewer = gqlData?.data?.viewer;
          const user = gqlData?.data?.user;

          if (viewer && viewer.login && viewer.login.toLowerCase() === cleanUsername.toLowerCase()) {
            const viewerCollection = viewer.contributionsCollection;
            const viewerCalendar = viewerCollection?.contributionCalendar;

            if (viewerCalendar) {
              weeks = viewerCalendar.weeks || [];
              totalContributions = viewerCalendar.totalContributions || 0;
            }

            const ownerCount = viewer.repositories?.totalCount || 0;
            const allCount = viewer.allAffiliated?.totalCount || 0;
            totalRepos = Math.max(totalRepos, ownerCount, allCount);
          } else if (user) {
            const userCollection = user.contributionsCollection;
            const userCalendar = userCollection?.contributionCalendar;

            if (userCalendar) {
              weeks = userCalendar.weeks || [];
              totalContributions = userCalendar.totalContributions || 0;
            }

            const ownerCount = user.repositories?.totalCount || 0;
            const allCount = user.allAffiliated?.totalCount || 0;
            totalRepos = Math.max(totalRepos, ownerCount, allCount);
          }
        }
      } catch (gqlErr) {
        console.warn("GitHub GraphQL fetch error:", gqlErr);
      }
    }

    // 3. Fallback calendar if token unavailable or zero weeks returned
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
      publicRepos: totalRepos,
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
