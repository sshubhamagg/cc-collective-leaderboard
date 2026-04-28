import type { ReactElement } from "react";

import type { LeaderboardEntry } from "@/lib/leaderboard";
import { formatCurrency } from "@/lib/utils";

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardTable({
  entries,
}: LeaderboardTableProps): ReactElement {
  if (entries.length === 0) {
    return (
      <section className="empty-surface">
        <p>No leaderboard snapshot is available yet.</p>
      </section>
    );
  }

  return (
    <section className="leaderboard-table-shell">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Creator Name</th>
            <th className="text-right">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={`${String(entry.rank)}-${entry.fullName}`}
              className="leaderboard-row"
            >
              <td className="leaderboard-rank">{entry.rank}</td>
              <td className="leaderboard-name">{entry.fullName}</td>
              <td className="leaderboard-metric">
                {formatCurrency(entry.revenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
