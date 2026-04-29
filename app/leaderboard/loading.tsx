import type { ReactElement } from "react";

import { LeaderboardPageSkeleton } from "@/components/leaderboard-skeleton";
import { SectionHeader } from "@/components/ui/section-header";

export default function LeaderboardLoading(): ReactElement {
  return (
    <main className="min-h-screen">
      <div className="page-shell">
        <div className="page-stack">
          <SectionHeader
            eyebrow="Conscious Chemist Creator OS"
            title="Daily Creator Leaderboard"
            description="Public revenue leaderboard ranked only by revenue, refreshed into daily snapshots for a clean and transparent view of creator performance."
            meta={
              <div className="section-stack">
                <p className="meta-label">Last Updated</p>
                <div className="skeleton h-4 w-32 rounded" />
              </div>
            }
            useSerifTitle
          />
          <LeaderboardPageSkeleton />
        </div>
      </div>
    </main>
  );
}
