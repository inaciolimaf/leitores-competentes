export type Theme = "claro" | "escuro";

const STORAGE_KEY = "leitores-tema";

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "claro" || value === "escuro" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "escuro" ? "escuro" : "claro";
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private windows may refuse storage; the theme still applies to this visit.
  }
}

export function initTheme() {
  document.documentElement.dataset.theme = readStored() ?? systemTheme();
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!readStored()) document.documentElement.dataset.theme = systemTheme();
  });
}
