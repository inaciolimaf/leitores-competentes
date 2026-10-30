import { useEffect, useRef } from "react";

// The screen's one h1: moves focus and updates document.title whenever the title changes.
export function ScreenTitle({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = `${children} — Leitores Competentes`;
    window.scrollTo(0, 0);
    ref.current?.focus({ preventScroll: true });
  }, [children]);

  return (
    <h1 ref={ref} tabIndex={-1} className="screen-title">
      {children}
    </h1>
  );
}
