import { z } from "zod";

export const createUserValidator = z.object({
  username: z.string(),
  password: z.string(),
});

export const loginUserValidator = z.object({});

export type CreateTodo = z.infer<typeof createUserValidator>;
