import type { CSSProperties, ReactElement } from "react";

import { Sparkline } from "@/components/ui/sparkline";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { formatCurrency } from "@/lib/utils";

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
  /** Full ranked list (pre-search) used for the revenue bar baseline */
  allEntries: LeaderboardEntry[];
  periodLabel: string;
  onRowClick: (entry: LeaderboardEntry) => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getRankBadgeClass(rank: number): string {
  if (rank === 1) return "rank-badge rank-badge-gold";
  if (rank === 2) return "rank-badge rank-badge-silver";
  if (rank === 3) return "rank-badge rank-badge-bronze";
  return "rank-badge rank-badge-default";
}

function getRowClass(rank: number): string {
  const base = "leaderboard-row leaderboard-row-clickable";
  if (rank === 1) return `${base} leaderboard-row-gold`;
  if (rank === 2) return `${base} leaderboard-row-silver`;
  if (rank === 3) return `${base} leaderboard-row-bronze`;
  return base;
}

function TrendBadge({
  current,
  previous,
}: {
  current: number;
  previous?: number;
}): ReactElement | null {
  if (previous === undefined || previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  const abs = Math.abs(pct).toFixed(1);
  if (pct > 0.05)
    return <span className="trend-badge trend-up">▲ {abs}%</span>;
  if (pct < -0.05)
    return <span className="trend-badge trend-down">▼ {abs}%</span>;
  return <span className="trend-badge trend-neutral">—</span>;
}

function RankDelta({
  current,
  previous,
}: {
  current: number;
  previous?: number;
}): ReactElement | null {
  if (previous === undefined) return null;
  const delta = previous - current;
  if (delta > 0)
    return <span className="rank-delta rank-delta-up">▲{delta}</span>;
  if (delta < 0)
    return (
      <span className="rank-delta rank-delta-down">▼{Math.abs(delta)}</span>
    );
  return <span className="rank-delta rank-delta-same">—</span>;
}

export function LeaderboardTable({
  entries,
  allEntries,
  periodLabel,
  onRowClick,
}: LeaderboardTableProps): ReactElement {
  if (entries.length === 0) {
    return (
      <section className="empty-surface">
        <p>No leaderboard snapshot is available yet.</p>
      </section>
    );
  }

  const maxRevenue = Math.max(...allEntries.map((e) => e.revenue));

  return (
    <section className="leaderboard-table-shell">
      <div className="leaderboard-table-header">
        <span className="leaderboard-table-label">
          All Rankings{periodLabel}
        </span>
        <span className="leaderboard-table-count">
          {allEntries.length} creators
        </span>
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Creator</th>
            <th className="text-right">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={`${String(entry.rank)}-${entry.fullName}`}
              className={getRowClass(entry.rank)}
              onClick={() => onRowClick(entry)}
            >
              {/* Rank + delta */}
              <td className="leaderboard-rank">
                <div className="flex flex-col items-center gap-0.5">
                  <span className={getRankBadgeClass(entry.rank)}>
                    {entry.rank}
                  </span>
                  <RankDelta
                    current={entry.rank}
                    previous={entry.previousRank}
                  />
                </div>
              </td>

              {/* Avatar + name */}
              <td className="leaderboard-name">
                <div className="flex items-center gap-3">
                  <span className="creator-avatar">
                    {getInitials(entry.fullName)}
                  </span>
                  <span>{entry.fullName}</span>
                </div>
              </td>

              {/* Sparkline + revenue + trend + bar */}
              <td className="leaderboard-metric">
                <div className="sparkline-cell">
                  {entry.revenueHistory && entry.revenueHistory.length >= 2 && (
                    <Sparkline data={entry.revenueHistory} />
                  )}
                  <div>
                    <span>
                      {formatCurrency(entry.revenue)}
                      <TrendBadge
                        current={entry.revenue}
                        previous={entry.previousRevenue}
                      />
                    </span>
                    <div className="revenue-bar-track">
                      <div
                        className="revenue-bar-fill"
                        style={
                          {
                            width: `${((entry.revenue / maxRevenue) * 100).toFixed(1)}%`,
                          } as CSSProperties
                        }
                      />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
