import type { ReactNode } from "react";

interface BookProps {
  section: string;
  sectionDetail?: string;
  children: ReactNode;
}

export function Book({ section, sectionDetail, children }: BookProps) {
  return (
    <div className="book" data-book>
      <a href="#page-content" className="skip-link">
        Ir para o conteúdo
      </a>
      <div className="book-sheet">
        <header className="book-header">
          <span className="book-running-head" title={sectionDetail}>
            {section}
            {sectionDetail && ` · ${sectionDetail}`}
          </span>
        </header>
        <main id="page-content" className="contents">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SpreadProps {
  left?: ReactNode;
  leftLabel?: string;
  right: ReactNode;
  rightLabel: string;
  pageKey?: number | string;
}

export function Spread({ left, leftLabel, right, rightLabel, pageKey }: SpreadProps) {
  return (
    <div key={pageKey} className={`spread page-in ${left ? "spread-two" : ""}`}>
      {left && <section className="page" aria-label={leftLabel}>{left}</section>}
      <section className="page" aria-label={rightLabel}>{right}</section>
    </div>
  );
}

export function Folio({ children }: { children: ReactNode }) {
  return <footer className="folio">{children}</footer>;
}
