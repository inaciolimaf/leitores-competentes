import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const DIR = "src/styles";
const ANIMATABLE = new Set([
  "transform",
  "translate",
  "rotate",
  "scale",
  "opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
]);
// Valid inside a keyframe, but they configure the step: nothing animates through them.
const STEP_SETTINGS = new Set(["animation-timing-function", "animation-composition"]);
const FORBIDDEN_TRANSITION = ["width", "height", "top", "left", "box-shadow", "filter", "background-position", "all"];

function withoutComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function blockFrom(css: string, open: number) {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error("Unbalanced braces");
}

function keyframes(css: string) {
  return [...css.matchAll(/@keyframes\s+([\w-]+)\s*{/g)].map((m) => {
    const body = blockFrom(css, m.index + m[0].length - 1);
    const properties = [...body.matchAll(/[{;]\s*([\w-]+)\s*:/g)].map((p) => p[1]);
    return { name: m[1], properties };
  });
}

function badKeyframes(css: string) {
  return keyframes(withoutComments(css)).flatMap(({ name, properties }) =>
    properties.filter((p) => !ANIMATABLE.has(p) && !STEP_SETTINGS.has(p)).map((p) => `${name}: ${p}`),
  );
}

function badTransitions(css: string) {
  const declarations = withoutComments(css).matchAll(/(?:^|[{;\s])transition(?:-property)?\s*:\s*([^;}]+)/g);
  return [...declarations].flatMap((m) =>
    m[1].split(",").flatMap((part) => {
      const property = part.trim().split(/\s+/)[0];
      return FORBIDDEN_TRANSITION.includes(property) ? [property] : [];
    }),
  );
}

function has100vh(css: string) {
  return /(^|[^\w.-])100vh\b/.test(withoutComments(css));
}

const sheets = readdirSync(DIR)
  .filter((file) => file.endsWith(".css"))
  .map((file) => [file, readFileSync(`${DIR}/${file}`, "utf8")] as const);

describe("the stylesheets", () => {
  it("are found, and some of them animate", () => {
    expect(sheets.length).toBeGreaterThan(0);
    expect(sheets.flatMap(([, css]) => keyframes(css)).length).toBeGreaterThan(0);
  });

  it.each(sheets)("%s animates only cheap properties", (_file, css) => {
    expect(badKeyframes(css)).toEqual([]);
  });

  it.each(sheets)("%s does not transition forbidden properties", (_file, css) => {
    expect(badTransitions(css)).toEqual([]);
  });

  it.each(sheets)("%s does not use 100vh", (_file, css) => {
    expect(has100vh(css)).toBe(false);
  });
});

describe("the checks themselves", () => {
  it("catch a forbidden property in any step of a keyframe", () => {
    const css = "@keyframes a { from { opacity: 0; width: 1px } 50% { transform: none; box-shadow: none } to { top: 0 } }";
    expect(badKeyframes(css)).toEqual(["a: width", "a: box-shadow", "a: top"]);
  });

  it("allow cheap properties, a timing function and comments", () => {
    const css = "/* width: 0 */ @keyframes a { to { scale: 1; animation-timing-function: ease; opacity: 1 } }";
    expect(badKeyframes(css)).toEqual([]);
  });

  it("catch forbidden transitions, and leave long-hand timing alone", () => {
    expect(badTransitions(".a { transition: opacity 1s, width 1s; }")).toEqual(["width"]);
    expect(badTransitions(".a { transition-property: left }")).toEqual(["left"]);
    expect(badTransitions(".a { transition: all 1s }")).toEqual(["all"]);
    expect(badTransitions(".a { transition-duration: 1s; transition: opacity 1s }")).toEqual([]);
  });

  it("catch 100vh and not 100vw, 100dvh or a comment", () => {
    expect(has100vh(".a { min-height: calc(100vh - 1rem) }")).toBe(true);
    expect(has100vh(".a { min-height: 100dvh; width: 100vw } /* 100vh */")).toBe(false);
  });
});
