import { getPrismaClient } from "@/lib/prisma";
import { refreshLeaderboard } from "@/lib/refresh-leaderboard";

let prismaClient: ReturnType<typeof getPrismaClient> | undefined;

async function main(): Promise<void> {
  prismaClient = getPrismaClient();
  const result = await refreshLeaderboard(prismaClient);

  console.info("Leaderboard refresh completed.");
  console.info(
    JSON.stringify(
      {
        sourceDate: result.sourceDate.toISOString(),
        snapshotDate: result.snapshotDate.toISOString(),
        sourceRowCount: result.sourceRowCount,
        snapshotRowCount: result.snapshotRowCount,
        createdSourceRows: result.createdSourceRows,
        updatedSourceRows: result.updatedSourceRows,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error: unknown) => {
    console.error("Leaderboard refresh failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (typeof prismaClient !== "undefined") {
      await prismaClient.$disconnect();
    }
  });
