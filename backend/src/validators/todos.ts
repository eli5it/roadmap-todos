import { z } from "zod";

export const createTodoValidator = z.object({
  content: z.string(),
  dueDate: z.coerce.date(),
  isCompleted: z.boolean().optional(),
});

export type CreateTodo = z.infer<typeof createTodoValidator>;
