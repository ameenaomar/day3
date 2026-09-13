#!/usr/bin/env node
/**
 * Fails the build if a physical-direction Tailwind utility appears anywhere in
 * the source. The site must be fully RTL-safe, so only logical utilities are
 * allowed: ps-/pe-, ms-/me-, start-/end-, text-start/text-end, border-s/border-e.
 *
 * Also enforces the flat-editorial rules: no rounded corners, no shadows, no
 * gradients.
 *
 * Run: npm run check:logical
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".css"]);

/** Each rule is matched against whole class tokens only. */
const RULES = [
  { name: "padding-left/right", pattern: /p[lr]-/, use: "ps-/pe-" },
  { name: "margin-left/right", pattern: /m[lr]-/, use: "ms-/me-" },
  { name: "left/right inset", pattern: /(?:left|right)-/, use: "start-/end-" },
  { name: "text-left/right", pattern: /text-(?:left|right)/, use: "text-start/text-end" },
  { name: "border-l/r", pattern: /border-[lr](?:-|$)/, use: "border-s/border-e" },
  { name: "float/clear left|right", pattern: /(?:float|clear)-(?:left|right)/, use: "float-start/float-end" },
  { name: "scroll-margin/padding l|r", pattern: /scroll-[pm][lr]-/, use: "scroll-ps-/scroll-ms-" },
  { name: "rounded corners", pattern: /rounded(?:-|$)/, use: "nothing — the design is flat" },
  { name: "box shadow", pattern: /shadow-/, use: "nothing — the design has no shadows" },
  { name: "gradient", pattern: /bg-(?:gradient|linear|radial|conic)/, use: "a flat colour" },
];

/** Tailwind class token, allowing variants (sm:, hover:) and negatives (-mr-2). */
const TOKEN = /(?<![\w-])-?(?:[a-z0-9-]+:)*[a-z][a-z0-9-]*(?:\/[0-9]+)?(?![\w-])/g;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(full.slice(full.lastIndexOf(".")))) yield full;
  }
}

const violations = [];

for (const root of ROOTS) {
  let exists = true;
  try {
    statSync(root);
  } catch {
    exists = false;
  }
  if (!exists) continue;

  for (const file of walk(root)) {
    const source = readFileSync(file, "utf8");
    source.split("\n").forEach((line, index) => {
      // Skip comment lines: they discuss the banned utilities by name.
      const trimmed = line.trim();
      if (trimmed.startsWith("*") || trimmed.startsWith("//") || trimmed.startsWith("/*")) return;

      for (const token of line.match(TOKEN) ?? []) {
        const bare = token.replace(/^-/, "").replace(/^(?:[a-z0-9-]+:)*/, "");
        for (const rule of RULES) {
          if (rule.pattern.test(bare)) {
            violations.push(
              `${relative(process.cwd(), file)}:${index + 1}  ${token}` +
                `  — ${rule.name}; use ${rule.use}`,
            );
          }
        }
      }
    });
  }
}

if (violations.length > 0) {
  console.error("Physical-direction or non-flat utilities found:\n");
  for (const v of violations) console.error("  " + v);
  console.error(`\n${violations.length} violation(s).`);
  process.exit(1);
}

console.log("OK — no physical-direction, rounded, shadow or gradient utilities.");
