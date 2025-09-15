"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tests/setup.ts
const vitest_1 = require("vitest");
const pglite_1 = require("@electric-sql/pglite");
const pglite_2 = require("drizzle-orm/pglite");
const drizzle_orm_1 = require("drizzle-orm");
// Create a PGlite client for testing
const testClient = new pglite_1.PGlite();
const testDb = (0, pglite_2.drizzle)(testClient);
// Patch the db import
const dbModule = __importStar(require("../src/db")); // import everything
Object.defineProperty(dbModule, "db", {
    value: testDb,
    writable: false,
});
// Apply migrations once
(0, vitest_1.beforeAll)(async () => {
    // If using drizzle-pglite migrator
    const { migrate } = await Promise.resolve().then(() => __importStar(require("drizzle-orm/pglite/migrator")));
    await migrate(testDb, { migrationsFolder: "./drizzle" });
});
// Truncate tables before each test
(0, vitest_1.beforeEach)(async () => {
    await testDb.execute((0, drizzle_orm_1.sql) `TRUNCATE TABLE users, todos RESTART IDENTITY CASCADE`);
});
// Clean up after all tests
(0, vitest_1.afterAll)(async () => {
    await testClient.terminate?.();
});
