import type { ReactElement, ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  useSerifTitle?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  meta,
  useSerifTitle = false,
}: SectionHeaderProps): ReactElement {
  return (
    <header className="section-header-row">
      <div className="section-header">
        <p className="section-kicker">{eyebrow}</p>
        <div className="section-stack">
          <h1
            className={`section-title ${useSerifTitle ? "section-title-serif" : ""}`}
          >
            {title}
          </h1>
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
      </div>
      {meta ? <div className="min-w-fit">{meta}</div> : null}
    </header>
  );
}
