import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todosController";

const todosRouter = Router();
todosRouter.post("/", createTodo);
todosRouter.delete("/:todoId", deleteTodo);
todosRouter.put("/:todoId", updateTodo);
todosRouter.get("/", getTodos);

export default todosRouter;
