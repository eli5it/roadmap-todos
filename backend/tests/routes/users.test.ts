import { describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "../../src/server";

const api = request(app);

describe("Register User", () => {
  test("A valid user can be created, and a 201 response code is returned", async () => {
    const res = await api.post("/api/auth/register").send({
      username: "Elijah",
      password: "password",
    });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe("Elijah");
  });
  test("Attempting to create a duplicate user gives a helpful message", async () => {
    // First creation
    const firstResponse = await api.post("/api/auth/register").send({
      username: "Elijah",
      password: "password",
    });
    expect(firstResponse.status).toBe(201);

    // Attempt duplicate creation
    const res = await api.post("/api/auth/register").send({
      username: "Elijah",
      password: "password",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "User with username Elijah already exists in the database."
    );
  });
  test("Users with invalid username lengths cannot be created", async () => {
    const res1 = await api.post("/api/auth/register").send({
      username: "El",
      password: "Guhfds",
    });
    const res2 = await api.post("/api/auth/register").send({
      username: "Elfdafdafdafdsafdafdsafdafdsf",
      password: "GuFDSSF",
    });

    expect(res1.status).toBe(400);
    expect(res2.status).toBe(400);
  });
});
