import { Request, Response } from "express";
import { createTodoValidator } from "../validators/todos";
import z from "zod";
import {
  BadRequestError,
  DBInputError,
  NotFoundError,
  UnauthorizedError,
} from "../errors";
import {
  createTodo as createDbTodo,
  deleteTodo as deleteDbTodo,
  updateTodo as updateDbTodo,
  getTodos as getDbTodos,
  getTodoById,
} from "../db/queries/todos";

export async function createTodo(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const newTodoData = createTodoValidator.parse(req.body);
    const todo = await createDbTodo({ ...newTodoData, userId: user.id });
    return res.status(201).json(todo);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      throw new BadRequestError(`Validation failed: ${JSON.stringify(err)}`);
    }
    if (err instanceof DBInputError) {
      throw new BadRequestError(err.message);
    }
    throw err;
  }
}

export async function updateTodo(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError("Unauthorized");
  }

  const todoId = parseInt(req.params.todoId);
  const todoToUpdate = todoId ? await getTodoById(todoId) : null;
  const validId = todoToUpdate?.userId === req.user.id;
  if (validId) {
    throw new BadRequestError("Invalid todo id provided");
  }

  try {
    const todoData = await createTodoValidator.parse(req.body);
    const updatedTodo = await updateDbTodo(todoData);
    return res.json(updatedTodo);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new BadRequestError(`Validation failed: ${JSON.stringify(err)}`);
    }

    if (err instanceof DBInputError) {
      throw new BadRequestError(err.message);
    }
    throw err;
  }
}

export async function deleteTodo(req: Request, res: Response) {
  const todoId = parseInt(req.params.todoId);
  if (isNaN(todoId)) {
    throw new BadRequestError("Invalid todo id provided");
  }

  try {
    const todoToDelete = await getTodoById(todoId);
    if (!todoToDelete) {
      throw new NotFoundError(`Could not find todo with id ${todoId}`);
    }

    if (todoToDelete?.userId !== req.user?.id) {
      throw new UnauthorizedError("Unauthorized");
    }

    await deleteDbTodo(todoId);
    return res.status(204).send();
  } catch (err) {
    throw new Error("something went wrong");
  }
}

export async function getTodos(req: Request, res: Response) {
  const user = req?.user;
  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  const todos = await getDbTodos(user.id);
  return res.json(todos);
}
