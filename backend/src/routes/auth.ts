import { Router } from "express";
import {
  registerUser,
  loginUser,
  validateUser,
} from "../controllers/authController";

const usersRouter = Router();

usersRouter.post("/register", registerUser);
usersRouter.post("/login", loginUser);
usersRouter.get("/me", validateUser);

export default usersRouter;
