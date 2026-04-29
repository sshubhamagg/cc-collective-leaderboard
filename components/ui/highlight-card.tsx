import type { ReactElement, ReactNode } from "react";

type RankVariant = "gold" | "silver" | "bronze";

type HighlightCardProps = {
  label: string;
  title: string;
  value: string;
  meta?: string;
  ornament?: ReactNode;
  serifTitle?: boolean;
  rankVariant?: RankVariant;
  featured?: boolean;
  className?: string;
};

export function HighlightCard({
  label,
  title,
  value,
  meta,
  ornament,
  serifTitle = false,
  rankVariant,
  featured = false,
  className,
}: HighlightCardProps): ReactElement {
  const cardClasses = [
    "highlight-card",
    rankVariant ? `highlight-card-${rankVariant}` : "",
    featured ? "highlight-card-featured" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const valueClass = [
    "highlight-card-value",
    rankVariant ? `rank-value-${rankVariant}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClasses}>
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
        <p className={valueClass}>{value}</p>
        {meta ? <p className="highlight-card-meta">{meta}</p> : null}
      </div>
    </article>
  );
}
