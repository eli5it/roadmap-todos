import { Router } from "express";
import { getUploadUrl } from "../controllers/usersController";

const usersRouter = Router();

usersRouter.post("/profile-picture", getUploadUrl);
export default usersRouter;
