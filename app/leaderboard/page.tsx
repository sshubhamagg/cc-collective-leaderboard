import type { ReactElement } from "react";

import { Header } from "@/components/header";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { TopCreators } from "@/components/top-creators";
import { getLatestLeaderboardSnapshot } from "@/lib/leaderboard-query";
import { getPrismaClient } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function LeaderboardPage(): Promise<ReactElement> {
  const latestLeaderboard =
    await getLatestLeaderboardSnapshot(getPrismaClient());
  const lastUpdatedLabel =
    latestLeaderboard.lastUpdatedAt === null
      ? "Not available"
      : formatDateTime(latestLeaderboard.lastUpdatedAt);

  return (
    <main className="min-h-screen">
      <div className="page-shell">
        <div className="page-stack">
          <Header lastUpdated={lastUpdatedLabel} />
          <TopCreators entries={latestLeaderboard.entries} />
          <LeaderboardTable entries={latestLeaderboard.entries} />
        </div>
      </div>
    </main>
  );
}
