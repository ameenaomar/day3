#!/usr/bin/env bash
# Rebuild the self-hosted font subsets in public/fonts.
#
# The faces are pulled from the @fontsource packages (which repackage the
# upstream OFL releases), then subset to only the glyphs this app renders. That
# takes the five files from 137KB to 73KB, which matters: an English page loads
# 9.5KB of fonts instead of 33KB, on a phone on a Kuwaiti mobile connection.
#
# Re-run this if a face is added, a weight is added, or the app starts using
# glyphs outside the ranges below — a missing glyph shows as a fallback in the
# wrong font, so check both locales afterwards.
#
# Requires: python3 with fonttools and brotli (pip install fonttools brotli).

set -euo pipefail
cd "$(dirname "$0")/.."

# Latin text, plus the punctuation the copy uses.
LATIN='U+0020-007E,U+00A0,U+2018,U+2019,U+201C,U+201D,U+2013,U+2014,U+2022,U+2026,U+00D7'
# The progress bar: ███░░░
BLOCKS='U+2588,U+2591,U+2592,U+2593'
# Arabic, including Arabic-Indic digits (U+0660-0669), the decimal separator
# (U+066B) and the thousands separator (U+066C), which the KWD formatter needs.
ARABIC='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+061C'

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

npm --prefix "$TMP" install --no-fund --no-audit --silent \
  @fontsource/vt323 @fontsource/ibm-plex-mono @fontsource/ibm-plex-sans-arabic

src() { echo "$TMP/node_modules/@fontsource/$1/files/$2"; }

subset() {
  local input="$1" output="$2" unicodes="$3"
  python3 -m fontTools.subset "$input" \
    --unicodes="$unicodes" \
    --layout-features='*' \
    --flavor=woff2 \
    --no-hinting \
    --desubroutinize \
    --output-file="public/fonts/$output"
}

mkdir -p public/fonts

subset "$(src vt323 vt323-latin-400-normal.woff2)" \
  vt323-400.woff2 "$LATIN,$BLOCKS"
subset "$(src ibm-plex-mono ibm-plex-mono-latin-400-normal.woff2)" \
  plex-mono-400.woff2 "$LATIN,$BLOCKS"
subset "$(src ibm-plex-mono ibm-plex-mono-latin-600-normal.woff2)" \
  plex-mono-600.woff2 "$LATIN,$BLOCKS"
subset "$(src ibm-plex-sans-arabic ibm-plex-sans-arabic-arabic-400-normal.woff2)" \
  plex-arabic-400.woff2 "$ARABIC,$LATIN,$BLOCKS"
subset "$(src ibm-plex-sans-arabic ibm-plex-sans-arabic-arabic-600-normal.woff2)" \
  plex-arabic-600.woff2 "$ARABIC,$LATIN,$BLOCKS"

cp "$TMP/node_modules/@fontsource/vt323/LICENSE" public/fonts/LICENSE-VT323.txt
cp "$TMP/node_modules/@fontsource/ibm-plex-mono/LICENSE" public/fonts/LICENSE-IBM-Plex.txt

ls -l public/fonts/*.woff2
