import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/tokens.css", "utf8");

function themeBlock(selector: string) {
  const start = css.indexOf(selector);
  const open = css.indexOf("{", start);
  return css.slice(open, css.indexOf("}", open));
}

function readTokens(block: string) {
  const found: Record<string, [number, number, number]> = {};
  for (const m of block.matchAll(/--([\w-]+):\s*oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/g)) {
    found[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])];
  }
  return found;
}

function luminance([l, c, h]: [number, number, number]) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const x = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const y = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const z = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return (
    0.2126 * clamp(4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z) +
    0.7152 * clamp(-1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z) +
    0.0722 * clamp(-0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z)
  );
}

function contrast(a: [number, number, number], b: [number, number, number]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT_PAIRS = [
  ["ink", "paper"],
  ["ink", "desk"],
  ["ink-muted", "paper"],
  ["on-primary", "primary-solid"],
  ["on-mark", "mark"],
  ["correct-text", "correct-soft"],
  ["miss-text", "miss-soft"],
  ["error-text", "error-soft"],
];

const CONTROL_PAIRS = [
  ["control", "paper"],
  ["focus", "paper"],
  ["correct", "paper"],
  ["miss", "paper"],
  ["correct", "correct-soft"],
  ["miss", "miss-soft"],
];

describe.each([
  ["claro", ':root[data-theme="claro"]'],
  ["escuro", ':root[data-theme="escuro"]'],
])("contrast in %s", (_name, selector) => {
  const tokens = readTokens(themeBlock(selector));

  it.each(TEXT_PAIRS)("%s on %s reaches 4.5:1", (fg, bg) => {
    expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(4.5);
  });

  it.each(CONTROL_PAIRS)("%s on %s reaches 3:1", (fg, bg) => {
    expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(3);
  });
});
