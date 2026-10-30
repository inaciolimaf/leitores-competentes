// Initial JS budget: sums the gzip size of what index.html loads, modulepreloads included.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 250;
const dist = process.argv[2] ?? "dist";

function fail(message) {
  console.error(`check-bundle: ${message}`);
  process.exit(1);
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']?([^"'\\s>]+)`, "i"))?.[1];
}

function initialScripts(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*>/gi)].map(([tag]) => attribute(tag, "src"));
  const preloads = [...html.matchAll(/<link\b[^>]*>/gi)]
    .filter(([tag]) => {
      const rel = attribute(tag, "rel");
      return rel === "modulepreload" || (rel === "preload" && attribute(tag, "as") === "script");
    })
    .map(([tag]) => attribute(tag, "href"));
  return [...new Set([...scripts, ...preloads].filter(Boolean))];
}

let html;
try {
  html = readFileSync(join(dist, "index.html"), "utf8");
} catch {
  fail(`no ${join(dist, "index.html")}; run the build first`);
}

const files = initialScripts(html);
if (files.length === 0) fail("index.html loads no JS, so the budget would check nothing");

let totalBytes = 0;
for (const file of files) {
  if (/^(https?:)?\/\//.test(file)) fail(`${file} is external and cannot be measured`);
  const bytes = gzipSync(readFileSync(join(dist, file.replace(/^\//, "").split("?")[0]))).length;
  totalBytes += bytes;
  console.log(`${(bytes / 1000).toFixed(1).padStart(8)} KB  ${file}`);
}

const totalKb = totalBytes / 1000;
console.log(`${totalKb.toFixed(1).padStart(8)} KB  initial JS, gzip (budget ${BUDGET_KB} KB)`);
if (totalKb > BUDGET_KB) fail(`over budget by ${(totalKb - BUDGET_KB).toFixed(1)} KB`);
