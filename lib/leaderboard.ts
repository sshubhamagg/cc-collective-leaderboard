export type LeaderboardEntry = {
  rank: number;
  fullName: string;
  revenue: number;
  previousRevenue?: number;
  previousRank?: number;
  revenueHistory?: number[]; // oldest → newest, up to 7 daily data points
};
