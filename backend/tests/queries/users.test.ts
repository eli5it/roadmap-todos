import { describe, expect, test } from "vitest";
import { createUser } from "../../src/db/queries/users";

describe("Create User", () => {
  test("A user with valid username can be created", async () => {
    const newUser = await createUser({
      username: "Elijah",
      passwordHash: "passwordHash",
    });
    expect(newUser.username).toBe("Elijah");
  });
  test("A user with length < 3 cannot be created", async () => {
    await expect(async () => {
      await createUser({ username: "El", passwordHash: "password" });
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Username length must be between 4 and 20 characters",
        name: "DBInputError",
      })
    );
  });
  test("Duplicate users are handled appropriately", async () => {
    // First creation should succeed
    const firstUser = await createUser({
      username: "Schmeli",
      passwordHash: "passwordHash",
    });
    expect(firstUser.username).toBe("Schmeli");

    // Second creation should fail with specific error
    await expect(async () => {
      await createUser({ username: "Schmeli", passwordHash: "passwordHash" });
    }).rejects.toEqual(
      expect.objectContaining({
        message: "User with username Schmeli already exists in the database.",
        name: "DBInputError",
      })
    );
  });
});
