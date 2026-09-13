import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import type { NextConfig } from "next";

// This project sits beside an unrelated app in the same repository, and that
// app has its own lockfile. Pin the root so Turbopack never walks up into it.
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
