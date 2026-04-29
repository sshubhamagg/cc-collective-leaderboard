import type { SupabaseClient } from "@supabase/supabase-js";

import type { LeaderboardEntry } from "@/lib/leaderboard";

export type LatestLeaderboardSnapshot = {
  entries: LeaderboardEntry[];
  lastUpdatedAt: Date | null;
};

type HistoryRow = {
  snapshot_date: string;
  rank_position: number;
  revenue_generated: number | string;
  created_at: string;
  source: {
    full_name: string;
  } | null;
};

const HISTORY_DAYS = 7;
const MAX_CREATORS = 40;

export async function getLatestLeaderboardSnapshot(
  supabase: SupabaseClient,
): Promise<LatestLeaderboardSnapshot> {
  const { data: rows, error } = await supabase
    .from("leaderboard_daily_snapshot")
    .select(
      "snapshot_date,rank_position,revenue_generated,created_at,source:creator_performance_source(full_name)",
    )
    .order("snapshot_date", { ascending: false })
    .limit(HISTORY_DAYS * MAX_CREATORS)
    .overrideTypes<HistoryRow[], { merge: false }>();

  if (error !== null) {
    if (error.code === "PGRST205") {
      return { entries: [], lastUpdatedAt: null };
    }
    throw new Error(`Failed to load leaderboard: ${error.message}`);
  }

  if (rows.length === 0) {
    return { entries: [], lastUpdatedAt: null };
  }

  // Unique snapshot dates, newest first
  const dates = [...new Set(rows.map((r) => r.snapshot_date))]
    .sort()
    .reverse();
  const latestDate = dates[0];
  const previousDate = dates[1] ?? null;

  const latestRows = rows.filter((r) => r.snapshot_date === latestDate);

  const lastUpdatedAt = latestRows.reduce<Date | null>((latest, row) => {
    const d = new Date(row.created_at);
    return latest === null || d > latest ? d : latest;
  }, null);

  // Previous snapshot lookup maps
  const prevRevenueMap = new Map<string, number>();
  const prevRankMap = new Map<string, number>();
  if (previousDate !== null) {
    for (const row of rows.filter((r) => r.snapshot_date === previousDate)) {
      const name = row.source?.full_name ?? "Unknown creator";
      prevRevenueMap.set(name, Number(row.revenue_generated));
      prevRankMap.set(name, row.rank_position);
    }
  }

  // Revenue history per creator — oldest → newest (up to HISTORY_DAYS)
  const historyDates = dates.slice(0, HISTORY_DAYS).reverse();
  const historyMap = new Map<string, number[]>();
  for (const date of historyDates) {
    for (const row of rows.filter((r) => r.snapshot_date === date)) {
      const name = row.source?.full_name ?? "Unknown creator";
      const arr = historyMap.get(name) ?? [];
      arr.push(Number(row.revenue_generated));
      historyMap.set(name, arr);
    }
  }

  latestRows.sort((a, b) => a.rank_position - b.rank_position);

  const entries: LeaderboardEntry[] = latestRows.map((row) => {
    const name = row.source?.full_name ?? "Unknown creator";
    return {
      rank: row.rank_position,
      fullName: name,
      revenue: Number(row.revenue_generated),
      previousRevenue: prevRevenueMap.get(name),
      previousRank: prevRankMap.get(name),
      revenueHistory: historyMap.get(name),
    };
  });

  return { entries, lastUpdatedAt };
}
