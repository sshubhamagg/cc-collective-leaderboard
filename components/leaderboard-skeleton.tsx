import type { ReactElement } from "react";

function SkeletonHighlightCard(): ReactElement {
  return (
    <div className="highlight-card">
      <div className="skeleton h-3 w-16 rounded-full" />
      <div className="mt-10 flex flex-col gap-3">
        <div className="skeleton h-6 w-36 rounded" />
        <div className="skeleton h-5 w-24 rounded" />
        <div className="skeleton h-3 w-28 rounded" />
      </div>
    </div>
  );
}

function SkeletonRow({ index }: { index: number }): ReactElement {
  const nameWidths = ["w-32", "w-40", "w-28", "w-36", "w-44"];
  const nameW = nameWidths[index % nameWidths.length];

  return (
    <tr>
      <td className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="skeleton h-8 w-8 rounded-full" />
      </td>
      <td className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="skeleton h-9 w-9 flex-shrink-0 rounded-full" />
          <div className={`skeleton h-4 ${nameW} rounded`} />
        </div>
      </td>
      <td className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-end gap-3">
          <div className="skeleton h-5 w-14 rounded opacity-60" />
          <div className="skeleton h-5 w-24 rounded" />
        </div>
      </td>
    </tr>
  );
}

export function LeaderboardPageSkeleton(): ReactElement {
  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      {/* Top creators skeleton */}
      <section className="grid gap-4 md:grid-cols-3">
        <SkeletonHighlightCard />
        <SkeletonHighlightCard />
        <SkeletonHighlightCard />
      </section>

      {/* Controls skeleton */}
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 flex-1 rounded-xl" />
        <div className="skeleton h-10 w-48 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <section className="leaderboard-table-shell">
        <div className="leaderboard-table-header">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-5 w-20 rounded-full" />
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
            {Array.from({ length: 8 }, (_, i) => (
              <SkeletonRow key={i} index={i} />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
