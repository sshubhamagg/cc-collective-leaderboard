import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (typeof databaseUrl !== "string" || databaseUrl.length === 0) {
    throw new Error("DATABASE_URL is required to initialize Prisma.");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export function getPrismaClient(): PrismaClient {
  if (typeof globalThis.prisma === "undefined") {
    globalThis.prisma = createPrismaClient();
  }

  return globalThis.prisma;
}
