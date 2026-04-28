import type { ReactElement } from "react";

import { SectionHeader } from "@/components/ui/section-header";

type HeaderProps = {
  lastUpdated: string;
};

export function Header({ lastUpdated }: HeaderProps): ReactElement {
  return (
    <SectionHeader
      eyebrow="Conscious Chemist Creator OS"
      title="Daily Creator Leaderboard"
      description="Public revenue leaderboard ranked only by revenue, refreshed into daily snapshots for a clean and transparent view of creator performance."
      meta={
        <div className="section-stack">
          <p className="meta-label">Last Updated</p>
          <p className="meta-value">{lastUpdated}</p>
        </div>
      }
      useSerifTitle
    />
  );
}
