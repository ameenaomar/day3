import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 reads connection URLs from here (for the CLI) and from the driver
 * adapter in lib/db.ts (at runtime).
 *
 * Migrations run against the direct connection; the app runs through Neon's
 * pooler, because a serverless function per request will exhaust direct
 * connections.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: { path: path.join("prisma", "migrations") },
  // Read directly rather than through prisma/config's env(), which throws on a
  // missing variable — that would break `prisma generate` and `migrate diff`
  // for anyone who has not provisioned a database yet.
  datasource: { url: process.env.DIRECT_DATABASE_URL ?? "postgresql://unset" },
});
