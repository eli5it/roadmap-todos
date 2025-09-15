import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  connection: {
    connectionString:
      process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABASE_URL!
        : process.env.DATABASE_URL!,
  },
});

export const client = null;
