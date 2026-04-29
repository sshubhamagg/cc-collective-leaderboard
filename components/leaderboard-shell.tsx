"use client";

import { useState, useCallback, type ReactElement } from "react";

import { CreatorDrawer } from "@/components/creator-drawer";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { TopCreators } from "@/components/top-creators";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { formatCurrency } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly";

const PERIOD_LABELS: Record<Period, string> = {
  daily: "Daily",
  weekly: "7-Day",
  monthly: "30-Day",
};

const PERIODS: Period[] = ["daily", "weekly", "monthly"];

function computeDisplayRevenue(entry: LeaderboardEntry, period: Period): number {
  if (period === "daily") return entry.revenue;

  const history = entry.revenueHistory ?? [];
  if (history.length === 0) {
    return period === "weekly" ? entry.revenue * 7 : entry.revenue * 30;
  }

  const sum = history.reduce((acc, v) => acc + v, 0);
  if (period === "weekly") return sum;

  // monthly: avg daily × 30
  return (sum / history.length) * 30;
}

function getEntriesForPeriod(
  entries: LeaderboardEntry[],
  period: Period,
): LeaderboardEntry[] {
  if (period === "daily") return entries;

  const withRevenue = entries.map((entry) => ({
    ...entry,
    revenue: computeDisplayRevenue(entry, period),
  }));

  return withRevenue
    .sort((a, b) => b.revenue - a.revenue)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

type LeaderboardShellProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardShell({
  entries,
}: LeaderboardShellProps): ReactElement {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<Period>("daily");
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(
    null,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePeriodChange = useCallback(
    (next: Period) => {
      if (next === period) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setPeriod(next);
        setIsTransitioning(false);
      }, 140);
    },
    [period],
  );

  const handleClose = useCallback(() => setSelectedEntry(null), []);

  const periodEntries = getEntriesForPeriod(entries, period);

  const filtered =
    search.trim() === ""
      ? periodEntries
      : periodEntries.filter((e) =>
          e.fullName.toLowerCase().includes(search.toLowerCase()),
        );

  const periodLabel =
    period !== "daily"
      ? ` (${PERIOD_LABELS[period]} est.)`
      : "";

  return (
    <>
      <div
        style={{
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 140ms ease",
        }}
        className="flex flex-col gap-10 lg:gap-14"
      >
        {/* Top-3 podium — always shows top 3 of the current period */}
        <TopCreators entries={periodEntries} periodLabel={periodLabel} />

        {/* Controls */}
        <div className="leaderboard-controls">
          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9.5 9.5L13 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Search creator…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search creators"
            />
            {search !== "" && (
              <button
                className="search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Period toggle */}
          <div className="period-tabs" role="group" aria-label="Time period">
            {PERIODS.map((p) => (
              <button
                key={p}
                className={`period-tab ${period === p ? "period-tab-active" : ""}`}
                onClick={() => handlePeriodChange(p)}
                aria-pressed={period === p}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <LeaderboardTable
          entries={filtered}
          allEntries={periodEntries}
          periodLabel={periodLabel}
          onRowClick={setSelectedEntry}
        />

        {/* No results */}
        {search.trim() !== "" && filtered.length === 0 && (
          <p className="meta-value text-center py-4">
            No creators match &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      {/* Detail drawer */}
      <CreatorDrawer entry={selectedEntry} onClose={handleClose} />
    </>
  );
}

// Re-export formatCurrency for convenience (used in top-creators period label)
export { formatCurrency };
