import { useSyncExternalStore } from "react";

// Same width at which book.css opens the two pages.
const OPEN_BOOK = "(min-width: 60rem)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(OPEN_BOOK);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useIsOpenBook() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(OPEN_BOOK).matches);
}
