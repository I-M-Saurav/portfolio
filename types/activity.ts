export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface GitHubStats {
  username: string;
  name?: string;
  avatarUrl: string;
  bio?: string;
  publicRepos: number;
  followers: number;
  following: number;
  htmlUrl: string;
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface CodeforcesRatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export interface CodeforcesStats {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  avatar?: string;
  organization?: string;
  totalSolved: number;
  ratingHistory: {
    contest: string;
    rating: number;
    date: string;
  }[];
}
