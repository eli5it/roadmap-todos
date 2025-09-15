import { describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "../../src/server";

const api = request(app);

describe("POST /todos", () => {
  test("A valid todo can be created successfully", async () => {
    const userRes = await api.post("/api/auth/register").send({
      username: "Elijah2",
      password: "password",
    });

    // Extract cookies from registration response
    const cookies = userRes.headers["set-cookie"];
    expect(userRes.status).toBe(201);
    const user = userRes.body;
    expect(user.id).toBeDefined();
    expect(user.username).toBe("Elijah2");

    const dueDate = new Date();
    const newTodo = {
      content: "Do stuff",
      dueDate: dueDate.toISOString(), // Convert to ISO string for API
      userId: user.id,
      isCompleted: false,
    };

    // Set cookies for authentication
    const res = await api
      .post("/api/todos")
      .set("Cookie", cookies)
      .send(newTodo);
    expect(res.status).toBe(201);
    expect(res.body.content).toBe("Do stuff");
    expect(res.body.userId).toBe(user.id);
    expect(new Date(res.body.dueDate)).toEqual(dueDate);
  });
});

describe("DELETE /:todoId", () => {
  test("Deletion of todos works properly", async () => {
    // Create a user first through the API to ensure proper setup
    const userResponse = await api.post("/api/auth/register").send({
      username: "Elijah234",
      password: "Guhfs",
    });
    expect(userResponse.status).toBe(201);
    const userId = userResponse.body.id;
    const cookies = userResponse.headers["set-cookie"];

    // Create todo through API
    const todoResponse = await api
      .post("/api/todos")
      .set("Cookie", cookies)
      .send({
        content: "Do stuff",
        dueDate: new Date().toISOString(),
        userId: userId,
        isCompleted: false,
      });
    expect(todoResponse.status).toBe(201);

    // Delete the todo
    const res = await api
      .delete(`/api/todos/${todoResponse.body.id}`)
      .set("Cookie", cookies);
    expect(res.status).toBe(204);
  });
});
