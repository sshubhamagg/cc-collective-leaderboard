import type { SupabaseClient } from "@supabase/supabase-js";

import type { LeaderboardEntry } from "@/lib/leaderboard";

export type LatestLeaderboardSnapshot = {
  entries: LeaderboardEntry[];
  lastUpdatedAt: Date | null;
};

type LatestSnapshotRow = {
  snapshot_date: string;
};

type LeaderboardRow = {
  rank_position: number;
  revenue_generated: number | string;
  created_at: string;
  source: {
    full_name: string;
  } | null;
};

export async function getLatestLeaderboardSnapshot(
  supabase: SupabaseClient,
): Promise<LatestLeaderboardSnapshot> {
  const { data: latestSnapshot, error: latestSnapshotError } = await supabase
    .from("leaderboard_daily_snapshot")
    .select("snapshot_date")
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .overrideTypes<LatestSnapshotRow[], { merge: false }>();

  if (latestSnapshotError !== null) {
    // Return an empty state if tables are not provisioned yet in Supabase.
    if (latestSnapshotError.code === "PGRST205") {
      return {
        entries: [],
        lastUpdatedAt: null,
      };
    }
    throw new Error(`Failed to load latest snapshot: ${latestSnapshotError.message}`);
  }

  if (latestSnapshot.length === 0) {
    return {
      entries: [],
      lastUpdatedAt: null,
    };
  }

  const latestSnapshotDate = latestSnapshot[0].snapshot_date;
  const { data: leaderboardRows, error: leaderboardRowsError } = await supabase
    .from("leaderboard_daily_snapshot")
    .select(
      "rank_position,revenue_generated,created_at,source:creator_performance_source(full_name)",
    )
    .eq("snapshot_date", latestSnapshotDate)
    .order("rank_position", { ascending: true })
    .overrideTypes<LeaderboardRow[], { merge: false }>();

  if (leaderboardRowsError !== null) {
    throw new Error(`Failed to load leaderboard rows: ${leaderboardRowsError.message}`);
  }

  const lastUpdatedAt =
    leaderboardRows.length > 0
      ? leaderboardRows.reduce(
          (latest, row) =>
            new Date(row.created_at).getTime() > latest.getTime()
              ? new Date(row.created_at)
              : latest,
          new Date(leaderboardRows[0].created_at),
        )
      : null;

  return {
    entries: leaderboardRows.map((row) => ({
      rank: row.rank_position,
      fullName: row.source?.full_name ?? "Unknown creator",
      revenue: Number(row.revenue_generated),
    })),
    lastUpdatedAt,
  };
}
