import type { ReactElement, ReactNode } from "react";

type HighlightCardProps = {
  label: string;
  title: string;
  value: string;
  meta?: string;
  ornament?: ReactNode;
  serifTitle?: boolean;
};

export function HighlightCard({
  label,
  title,
  value,
  meta,
  ornament,
  serifTitle = false,
}: HighlightCardProps): ReactElement {
  return (
    <article className="highlight-card">
      <div className="flex items-start justify-between gap-4">
        <p className="highlight-card-label">{label}</p>
        {ornament ? <div className="shrink-0">{ornament}</div> : null}
      </div>
      <div className="mt-10 flex flex-col gap-2">
        <h2
          className={
            serifTitle ? "highlight-card-title-serif" : "highlight-card-title"
          }
        >
          {title}
        </h2>
        <p className="highlight-card-value">{value}</p>
        {meta ? <p className="highlight-card-meta">{meta}</p> : null}
      </div>
    </article>
  );
}
