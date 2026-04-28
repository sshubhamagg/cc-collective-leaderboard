import "dotenv/config";
import { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";

import {
  normalizeSourceDate,
  syncMockCreatorPerformanceSource,
} from "@/lib/mock-generator";
import { rankCreatorRevenueRows } from "@/lib/ranking-engine";

type RefreshLeaderboardOptions = {
  sourceDate?: Date;
};

export type RefreshLeaderboardResult = {
  sourceDate: Date;
  snapshotDate: Date;
  sourceRowCount: number;
  snapshotRowCount: number;
  createdSourceRows: number;
  updatedSourceRows: number;
};

function assertNoDuplicateCreatorNames(
  rows: ReadonlyArray<{ fullName: string }>,
): void {
  const seen = new Set<string>();

  for (const row of rows) {
    if (seen.has(row.fullName)) {
      throw new Error(
        `Duplicate creator_performance_source row found for full_name "${row.fullName}".`,
      );
    }

    seen.add(row.fullName);
  }
}

export async function refreshLeaderboard(
  prisma: PrismaClient,
  options: RefreshLeaderboardOptions = {},
): Promise<RefreshLeaderboardResult> {
  const snapshotDate = normalizeSourceDate(options.sourceDate);
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const sourceSyncResult = await syncMockCreatorPerformanceSource(tx, {
            sourceDate: snapshotDate,
          });

          const currentSourceRows = await tx.creatorPerformanceSource.findMany({
            select: {
              id: true,
              fullName: true,
              revenueGenerated: true,
            },
          });

          assertNoDuplicateCreatorNames(currentSourceRows);

          const rankedRows = rankCreatorRevenueRows(currentSourceRows);

          await tx.leaderboardSnapshot.deleteMany({
            where: {
              snapshotDate,
            },
          });

          await tx.leaderboardSnapshot.createMany({
            data: rankedRows.map((row) => ({
              sourceId: row.id,
              snapshotDate,
              revenueGenerated: row.revenueGenerated,
              rankPosition: row.rankPosition,
            })),
          });

          return {
            sourceDate: sourceSyncResult.sourceDate,
            snapshotDate,
            sourceRowCount: currentSourceRows.length,
            snapshotRowCount: rankedRows.length,
            createdSourceRows: sourceSyncResult.createdCount,
            updatedSourceRows: sourceSyncResult.updatedCount,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034" &&
        attempt < maxAttempts
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Leaderboard refresh failed after retry attempts.");
}
