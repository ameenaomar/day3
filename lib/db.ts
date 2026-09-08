import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma 7 needs a driver adapter. Neon's serverless driver rather than plain
 * TCP, because a serverless function per request will exhaust direct Postgres
 * connections.
 *
 * Query logging is deliberately off. Query parameters here include customers'
 * body measurements, and those must never reach a log.
 */
function create(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — see .env.example");
  }
  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
    log: ["warn", "error"],
  });
}

const globalForPrisma = globalThis as unknown as { __ssPrisma?: PrismaClient };

/**
 * Lazily constructed, so importing this module during a build without a
 * database configured does not throw.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    globalForPrisma.__ssPrisma ??= create();
    return Reflect.get(globalForPrisma.__ssPrisma, property, receiver);
  },
});
