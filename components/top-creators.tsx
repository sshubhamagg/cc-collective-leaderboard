import type { ReactElement } from "react";

import { HighlightCard } from "@/components/ui/highlight-card";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { formatCurrency } from "@/lib/utils";

type TopCreatorsProps = {
  entries: LeaderboardEntry[];
  periodLabel?: string;
};

export function TopCreators({
  entries,
  periodLabel = "",
}: TopCreatorsProps): ReactElement | null {
  if (entries.length === 0) {
    return null;
  }

  const [first, second, third] = entries.slice(0, 3);
  const meta = `Revenue generated${periodLabel}`;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {/* Rank 1 — center on desktop, elevated */}
      {first && (
        <HighlightCard
          key={`${String(first.rank)}-${first.fullName}`}
          label={`Rank ${String(first.rank)}`}
          title={first.fullName}
          value={formatCurrency(first.revenue)}
          meta={meta}
          serifTitle
          rankVariant="gold"
          featured
          className="md:order-2"
        />
      )}
      {/* Rank 2 — left on desktop */}
      {second && (
        <HighlightCard
          key={`${String(second.rank)}-${second.fullName}`}
          label={`Rank ${String(second.rank)}`}
          title={second.fullName}
          value={formatCurrency(second.revenue)}
          meta={meta}
          serifTitle
          rankVariant="silver"
          className="md:order-1"
        />
      )}
      {/* Rank 3 — right on desktop */}
      {third && (
        <HighlightCard
          key={`${String(third.rank)}-${third.fullName}`}
          label={`Rank ${String(third.rank)}`}
          title={third.fullName}
          value={formatCurrency(third.revenue)}
          meta={meta}
          serifTitle
          rankVariant="bronze"
          className="md:order-3"
        />
      )}
    </section>
  );
}
