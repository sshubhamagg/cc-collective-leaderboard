import type { ReactElement } from "react";

import { HighlightCard } from "@/components/ui/highlight-card";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { formatCurrency } from "@/lib/utils";

type TopCreatorsProps = {
  entries: LeaderboardEntry[];
};

export function TopCreators({
  entries,
}: TopCreatorsProps): ReactElement | null {
  if (entries.length === 0) {
    return null;
  }

  const topEntries = entries.slice(0, 3);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {topEntries.map((entry) => (
        <HighlightCard
          key={`${String(entry.rank)}-${entry.fullName}`}
          label={`Rank ${String(entry.rank)}`}
          title={entry.fullName}
          value={formatCurrency(entry.revenue)}
          meta="Revenue generated"
          serifTitle
        />
      ))}
    </section>
  );
}
