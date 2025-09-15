import "dotenv/config";

import {
  integer,
  pgTable,
  varchar,
  timestamp,
  boolean,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const todoTable = pgTable("todos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  content: varchar({ length: 255 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  userId: integer().references(() => userTable.id, {
    onDelete: "cascade",
  }),
  isCompleted: boolean().default(false).notNull(),
});

export const userTable = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    username: varchar({ length: 20 }).notNull().unique(),
    passwordHash: varchar({ length: 255 }).notNull(),
  },
  (table) => [check("username_check", sql`LENGTH(${table.username}) > 3`)]
);

export type InsertUser = typeof userTable.$inferInsert;
export type InsertTodo = typeof todoTable.$inferInsert;

export type SelectUser = typeof userTable.$inferSelect;
export type SelectTodo = typeof todoTable.$inferSelect;
