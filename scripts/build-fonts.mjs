/**
 * Build the self-hosted font subsets in public/fonts.
 *
 * The faces come from the @fontsource packages (which repackage the upstream
 * OFL releases) and are subset to only the glyphs this app renders. That takes
 * the five files from 137KB to a fraction of it, which matters: fonts are the
 * largest thing an first-time visitor downloads, and the brief asks for this to
 * work on a bad Kuwaiti mobile connection.
 *
 * Pure Node (harfbuzz via wasm) rather than pyftsubset, so it runs anywhere the
 * app builds — including on Vercel, where there is no Python toolchain. The
 * build runs it with --if-missing, so a checkout that already has the committed
 * subsets does nothing, and one without them regenerates byte-identical files
 * rather than shipping a page with no fonts.
 *
 *   node scripts/build-fonts.mjs              regenerate all
 *   node scripts/build-fonts.mjs --if-missing only fill in what is absent
 */

import { createRequire } from "node:module";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";

const require = createRequire(import.meta.url);
const OUT_DIR = path.join(process.cwd(), "public", "fonts");
const ifMissingOnly = process.argv.includes("--if-missing");

/** Latin text plus the punctuation the copy uses. */
const LATIN = charRange(0x20, 0x7e) + " ‘’“”–—•…×";
/** The progress bar: ███░░░ */
const BLOCKS = "█░▒▓";
/**
 * Arabic. The base block only: the presentation-form blocks (U+FB50-FDFF,
 * U+FE70-FEFF) are legacy precomposed shapes, and none of our text contains
 * them. Shaping into initial/medial/final forms is driven by the font's GSUB
 * table, which harfbuzz retains for the glyphs we keep, so joins are
 * unaffected — checked by screenshotting the Arabic pages.
 */
const ARABIC = charRange(0x0600, 0x06ff) + "‌‍‎‏؜";

function charRange(from, to) {
  let out = "";
  for (let code = from; code <= to; code += 1) out += String.fromCodePoint(code);
  return out;
}

/**
 * The latin faces are monospaced, so kerning and ligature features have
 * nothing to do and are dropped outright. The Arabic face keeps every layout
 * feature: its shaping into initial/medial/final forms IS a layout feature, and
 * saving a few KB is not worth risking a broken join.
 */
const LATIN_OPTIONS = { targetFormat: "woff2", noHinting: true, keepFeatures: [], dropTables: ["gasp"] };
const ARABIC_OPTIONS = { targetFormat: "woff2", noHinting: true, dropTables: ["gasp"] };

const FACES = [
  { out: "vt323-400.woff2", pkg: "@fontsource/vt323", file: "vt323-latin-400-normal.woff2", text: LATIN + BLOCKS, options: LATIN_OPTIONS },
  { out: "plex-mono-400.woff2", pkg: "@fontsource/ibm-plex-mono", file: "ibm-plex-mono-latin-400-normal.woff2", text: LATIN + BLOCKS, options: LATIN_OPTIONS },
  { out: "plex-mono-600.woff2", pkg: "@fontsource/ibm-plex-mono", file: "ibm-plex-mono-latin-600-normal.woff2", text: LATIN + BLOCKS, options: LATIN_OPTIONS },
  { out: "plex-arabic-400.woff2", pkg: "@fontsource/ibm-plex-sans-arabic", file: "ibm-plex-sans-arabic-arabic-400-normal.woff2", text: ARABIC + LATIN + BLOCKS, options: ARABIC_OPTIONS },
  { out: "plex-arabic-600.woff2", pkg: "@fontsource/ibm-plex-sans-arabic", file: "ibm-plex-sans-arabic-arabic-600-normal.woff2", text: ARABIC + LATIN + BLOCKS, options: ARABIC_OPTIONS },
];

const LICENCES = [
  { out: "LICENSE-VT323.txt", pkg: "@fontsource/vt323" },
  { out: "LICENSE-IBM-Plex.txt", pkg: "@fontsource/ibm-plex-mono" },
];

function sourcePath(pkg, file) {
  return path.join(path.dirname(require.resolve(`${pkg}/package.json`)), "files", file);
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

await mkdir(OUT_DIR, { recursive: true });

let built = 0;
let skipped = 0;

for (const face of FACES) {
  const target = path.join(OUT_DIR, face.out);
  if (ifMissingOnly && (await exists(target))) {
    skipped += 1;
    continue;
  }
  const original = await readFile(sourcePath(face.pkg, face.file));
  const subset = await subsetFont(original, face.text, face.options);
  await writeFile(target, subset);
  console.log(`${face.out}: ${original.length} -> ${subset.length} bytes`);
  built += 1;
}

for (const licence of LICENCES) {
  const target = path.join(OUT_DIR, licence.out);
  if (ifMissingOnly && (await exists(target))) continue;
  const dir = path.dirname(require.resolve(`${licence.pkg}/package.json`));
  await writeFile(target, await readFile(path.join(dir, "LICENSE")));
}

console.log(built === 0 ? `fonts: all present, nothing to build` : `fonts: built ${built}, skipped ${skipped}`);
