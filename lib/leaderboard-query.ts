import type { PrismaClient } from "@/generated/prisma/client";

import type { LeaderboardEntry } from "@/lib/leaderboard";

export type LatestLeaderboardSnapshot = {
  entries: LeaderboardEntry[];
  lastUpdatedAt: Date | null;
};

export async function getLatestLeaderboardSnapshot(
  prisma: PrismaClient,
): Promise<LatestLeaderboardSnapshot> {
  const latestSnapshot = await prisma.leaderboardSnapshot.findFirst({
    select: {
      snapshotDate: true,
    },
    orderBy: {
      snapshotDate: "desc",
    },
  });

  if (latestSnapshot === null) {
    return {
      entries: [],
      lastUpdatedAt: null,
    };
  }

  const leaderboardRows = await prisma.leaderboardSnapshot.findMany({
    where: {
      snapshotDate: latestSnapshot.snapshotDate,
    },
    orderBy: {
      rankPosition: "asc",
    },
    select: {
      rankPosition: true,
      revenueGenerated: true,
      createdAt: true,
      source: {
        select: {
          fullName: true,
        },
      },
    },
  });

  const lastUpdatedAt =
    leaderboardRows.length > 0
      ? leaderboardRows.reduce(
          (latest, row) =>
            row.createdAt.getTime() > latest.getTime() ? row.createdAt : latest,
          leaderboardRows[0].createdAt,
        )
      : null;

  return {
    entries: leaderboardRows.map((row) => ({
      rank: row.rankPosition,
      fullName: row.source.fullName,
      revenue: Number(row.revenueGenerated.toString()),
    })),
    lastUpdatedAt,
  };
}
