import type { ReactElement } from "react";

import { Header } from "@/components/header";
import { LeaderboardShell } from "@/components/leaderboard-shell";
import { getLatestLeaderboardSnapshot } from "@/lib/leaderboard-query";
import { createClient } from "@/utils/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function LeaderboardPage(): Promise<ReactElement> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const latestLeaderboard = await getLatestLeaderboardSnapshot(supabase);
  const lastUpdatedLabel =
    latestLeaderboard.lastUpdatedAt === null
      ? "Not available"
      : formatDateTime(latestLeaderboard.lastUpdatedAt);

  return (
    <main className="min-h-screen">
      <div className="page-shell">
        <div className="page-stack">
          <Header lastUpdated={lastUpdatedLabel} />
          <LeaderboardShell entries={latestLeaderboard.entries} />
        </div>
      </div>
    </main>
  );
}
