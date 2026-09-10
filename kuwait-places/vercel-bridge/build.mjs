// Fetches the site from a pinned commit of this repo at build time.
//
// Why: the Vercel MCP deploy tool takes file contents inline, and index.html
// plus places.js are ~107KB — too large to reproduce by hand without risking
// a silent typo in a file nothing here can read back to check. So the build
// machine pulls them instead, and the sha256 checks below mean a mismatched
// or truncated fetch fails the build rather than shipping a broken page.
//
// This is a bridge, not the destination. Once the Vercel project is linked to
// the repo (Settings → Git, root directory `kuwait-places`), Vercel builds the
// directory directly, every push deploys itself, and this folder can go.
//
// To redeploy a newer commit: update COMMIT and both hashes
//   git rev-parse HEAD && sha256sum index.html places.js login.html supabase-config.js

import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const COMMIT = "a80c6d091e163abd40227ec88c144f3cdbd38645";
const BASE =
  `https://raw.githubusercontent.com/ameenaomar/day3/${COMMIT}/kuwait-places/`;

const EXPECTED = {
  "index.html": "aa479a0e79b6f8650cf814238c9c28430804521fcf488bb17b1eda288c6fa1ac",
  "places.js": "70f4d0190e866b75fbafeb3e717fedbd12033168b4c83fd0f352d5768a906bee",
  "login.html": "e431225c3907ca000cbab38575f3046a14f8205e48b6f913ed31ace83ec9575f",
  "supabase-config.js": "256bbff1a1251b4561d330edf257fc7a83fd3f78ca947d2a48d163ca72021af2",
};

await mkdir("dist", { recursive: true });

for (const [name, want] of Object.entries(EXPECTED)) {
  const res = await fetch(BASE + name);
  if (!res.ok) {
    throw new Error(`${name}: HTTP ${res.status} from ${BASE + name}`);
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  const got = createHash("sha256").update(bytes).digest("hex");
  if (got !== want) {
    throw new Error(`${name}: sha256 mismatch\n  expected ${want}\n  got      ${got}`);
  }
  await writeFile(`dist/${name}`, bytes);
  console.log(`${name}: ${bytes.length} bytes, sha256 verified`);
}

console.log(`Built from commit ${COMMIT}`);
