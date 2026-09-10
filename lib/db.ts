import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma 7 needs a driver adapter, and this one has to be plain Postgres:
 * the database is Supabase, and Neon's serverless driver — which this used to
 * use — speaks Neon's own protocol. Pointed at Supabase it cannot connect at
 * all, which is what turned every sign-up into "something broke on our side".
 *
 * Connection pressure is handled by Supabase's transaction pooler rather than
 * by the driver, so DATABASE_URL must be the port 6543 pooler string. A
 * serverless function per request would exhaust direct connections in
 * minutes. `max: 1` keeps each function instance to a single connection,
 * because the pooler is the pool.
 *
 * Query logging is deliberately off. Query parameters here include customers'
 * body measurements, and those must never reach a log.
 */

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set — see .env.example");
    this.name = "DatabaseNotConfiguredError";
  }
}

export function databaseIsConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function create(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new DatabaseNotConfiguredError();

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 1 }),
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
