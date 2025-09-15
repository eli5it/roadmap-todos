import { describe, expect, test } from "vitest";
import { DBInputError } from "../../src/errors";
import { createTodo, deleteTodo, getTodos } from "../../src/db/queries/todos";
import { createUser } from "../../src/db/queries/users";
import { InsertTodo } from "../../src/db/schema";

describe("Create todo", () => {
  const today = new Date();
  const tommorow = new Date();
  tommorow.setDate(today.getDate() + 1);
  test("A valid todo can be created succesfully", async () => {
    const newUser = await createUser({
      username: "Elijah2",
      passwordHash: "password",
    });

    const todoData: InsertTodo = {
      userId: newUser.id,
      content: "Get groceries",
      dueDate: tommorow,
    };
    const newTodo = await createTodo(todoData);
    expect(newTodo.content).toBe(todoData.content);
  });
  test("A todo with an invalid userId cannot be created", async () => {
    const todoData: InsertTodo = {
      userId: 10000,
      content: "Get groceries",
      dueDate: tommorow,
    };
    await expect(createTodo(todoData)).rejects.toBeInstanceOf(DBInputError);
  });
});

describe("Delete todo", () => {
  test("A todo can be deleted succesfully", async () => {
    const newUser = await createUser({
      username: "Elijah23",
      passwordHash: "password",
    });
    const newTodo = await createTodo({
      content: "Example",
      userId: newUser.id,
      dueDate: new Date(),
    });
    await deleteTodo(newTodo.id);
    const allTodos = await getTodos(newUser.id);
    const containsNewTodo = allTodos.some((todo) => todo.id === newTodo.id);

    expect(containsNewTodo).toBe(false);
  });
});

describe("Get Todos", () => {
  test("Get todos returns every todo in the db, sorted by due date", async () => {
    const today = new Date();
    const tommorow = new Date();
    const nextDay = new Date();
    tommorow.setDate(today.getDate() + 1);
    nextDay.setDate(tommorow.getDate() + 1);

    const newUser = await createUser({
      username: "Schmeli2",
      passwordHash: "password",
    });
    const todo1 = await createTodo({
      content: "Todo 1",
      userId: newUser.id,
      dueDate: new Date(),
    });
    const todo2 = await createTodo({
      content: "Todo 2",
      userId: newUser.id,
      dueDate: new Date(),
    });
    const todo3 = await createTodo({
      content: "Todo 3",
      userId: newUser.id,
      dueDate: new Date(),
    });

    const allTodos = await getTodos(newUser.id);
    expect(allTodos[0].content).toBe(todo1.content);
    expect(allTodos[1].content).toBe(todo2.content);
    expect(allTodos[2].content).toBe(todo3.content);
  });
});
