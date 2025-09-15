import { db } from "..";
import { DBInputError, DBUnexpectedError } from "../../errors";
import { type InsertUser } from "../schema";
import { userTable } from "../schema";
import { DrizzleQueryError, eq } from "drizzle-orm";
import type { DatabaseError as PostgresError } from "pg";
export async function createUser(userData: InsertUser) {
  try {
    const [newUser] = await db
      .insert(userTable)
      .values({
        username: userData.username,
        passwordHash: userData.passwordHash,
      })
      .returning();

    return newUser;
  } catch (err: unknown) {
    if (err instanceof DrizzleQueryError) {
      const cause = err.cause as PostgresError | undefined;
      if (cause) {
        if (cause.code === "23505") {
          throw new DBInputError(
            `User with username ${userData.username} already exists in the database.`
          );
        }
        if (cause.code === "23514") {
          throw new DBInputError(
            "Username length must be between 4 and 20 characters"
          );
        }
        if (cause.code === "22001") {
          throw new DBInputError(
            "Username length must be between 4 and 20 characters"
          );
        }
      }
    }
    console.error(err);
    throw new DBUnexpectedError("Something went wrong");
  }
}

export async function getUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));
  return user;
}

export async function deleteUsers() {
  return await db.delete(userTable);
}
