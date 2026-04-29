"use client";

import { useEffect, type ReactElement } from "react";

import { Sparkline } from "@/components/ui/sparkline";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { formatCurrency } from "@/lib/utils";

type CreatorDrawerProps = {
  entry: LeaderboardEntry | null;
  onClose: () => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getRankVariant(
  rank: number,
): "gold" | "silver" | "bronze" | undefined {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return undefined;
}

function TrendRow({
  current,
  previous,
}: {
  current: number;
  previous?: number;
}): ReactElement | null {
  if (previous === undefined || previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  const abs = Math.abs(pct).toFixed(1);
  if (pct > 0)
    return (
      <span className="trend-badge trend-up">
        ▲ {abs}% vs yesterday
      </span>
    );
  if (pct < 0)
    return (
      <span className="trend-badge trend-down">
        ▼ {abs}% vs yesterday
      </span>
    );
  return (
    <span className="trend-badge trend-neutral">— No change vs yesterday</span>
  );
}

function RankDeltaRow({
  current,
  previous,
}: {
  current: number;
  previous?: number;
}): ReactElement | null {
  if (previous === undefined) return null;
  const delta = previous - current;
  if (delta > 0)
    return (
      <span className="trend-badge trend-up">
        ▲ {delta} rank{delta !== 1 ? "s" : ""} since yesterday
      </span>
    );
  if (delta < 0)
    return (
      <span className="trend-badge trend-down">
        ▼ {Math.abs(delta)} rank{Math.abs(delta) !== 1 ? "s" : ""} since
        yesterday
      </span>
    );
  return (
    <span className="trend-badge trend-neutral">— Same rank as yesterday</span>
  );
}

export function CreatorDrawer({
  entry,
  onClose,
}: CreatorDrawerProps): ReactElement {
  const open = entry !== null;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const variant = entry ? getRankVariant(entry.rank) : undefined;
  const rankBadgeClass = [
    "rank-badge",
    variant ? `rank-badge-${variant}` : "rank-badge-default",
  ].join(" ");

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${open ? "drawer-backdrop-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`creator-drawer ${open ? "creator-drawer-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={entry ? `${entry.fullName} detail` : "Creator detail"}
      >
        {/* Sticky header */}
        <div className="drawer-header">
          <span className="section-kicker">Creator Detail</span>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {entry && (
          <div className="drawer-body">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div
                className="creator-avatar"
                style={{ width: "3.25rem", height: "3.25rem", fontSize: "1rem" }}
              >
                {getInitials(entry.fullName)}
              </div>
              <div className="flex flex-col gap-1">
                <h2
                  className="section-title-serif"
                  style={{ fontSize: "1.4rem" }}
                >
                  {entry.fullName}
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={rankBadgeClass}
                    style={{ width: "1.75rem", height: "1.75rem", fontSize: "0.78rem" }}
                  >
                    {entry.rank}
                  </span>
                  <span className="meta-label">
                    Rank #{entry.rank}
                  </span>
                </div>
              </div>
            </div>

            <div className="drawer-divider" />

            {/* Revenue */}
            <div className="drawer-section">
              <p className="drawer-section-label">Today&apos;s Revenue</p>
              <p
                className={[
                  "drawer-stat-value",
                  variant ? `rank-value-${variant}` : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {formatCurrency(entry.revenue)}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <TrendRow
                  current={entry.revenue}
                  previous={entry.previousRevenue}
                />
                <RankDeltaRow
                  current={entry.rank}
                  previous={entry.previousRank}
                />
              </div>
            </div>

            {/* 7-day sparkline */}
            {entry.revenueHistory && entry.revenueHistory.length >= 2 && (
              <>
                <div className="drawer-divider" />
                <div className="drawer-section">
                  <p className="drawer-section-label">
                    {entry.revenueHistory.length}-Day Revenue Trend
                  </p>
                  <div
                    className="surface-card"
                    style={{ padding: "1rem" }}
                  >
                    <Sparkline
                      data={entry.revenueHistory}
                      width={316}
                      height={72}
                      large
                    />
                    <div className="flex justify-between mt-2">
                      <span className="meta-label" style={{ fontSize: "0.63rem" }}>
                        {entry.revenueHistory.length}d ago
                      </span>
                      <span className="meta-label" style={{ fontSize: "0.63rem" }}>
                        Today
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Previous comparison */}
            {entry.previousRevenue !== undefined && (
              <>
                <div className="drawer-divider" />
                <div className="drawer-section">
                  <p className="drawer-section-label">Yesterday</p>
                  <p className="meta-value" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    {formatCurrency(entry.previousRevenue)}
                  </p>
                  {entry.previousRank !== undefined && (
                    <p className="meta-value">Ranked #{entry.previousRank}</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
