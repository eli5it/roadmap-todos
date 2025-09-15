// tests/setup.ts
import { beforeAll, beforeEach, afterAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { sql } from "drizzle-orm";

// Create a PGlite client for testing
const testClient = new PGlite();
const testDb = drizzle(testClient);

// Patch the db import
import * as dbModule from "../src/db"; // import everything
Object.defineProperty(dbModule, "db", {
  value: testDb,
  writable: false,
});

// Apply migrations once
beforeAll(async () => {
  // If using drizzle-pglite migrator
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  await migrate(testDb, { migrationsFolder: "./drizzle" });
});

// Truncate tables before each test
beforeEach(async () => {
  await testDb.execute(
    sql`TRUNCATE TABLE users, todos RESTART IDENTITY CASCADE`
  );
});

// Clean up after all tests
afterAll(async () => {
  await (testClient as any).terminate?.();
});
