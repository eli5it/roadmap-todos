import express from "express";
import authRouter from "./routes/auth";
import todosRouter from "./routes/todos";
import usersRouter from "./routes/users";
import { errorHandler } from "./middleware/errorHandler";
import { authHandler } from "./middleware/authHandler";
import path from "path";
import cookieParser from "cookie-parser";

export const app = express();

// serve react frontend
const frontendPath = path.join(__dirname, "..", "public");
app.use(express.static(frontendPath));

app.use(express.json());
app.use(cookieParser());
app.use(authHandler);

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use("/api/todos", todosRouter);

app.use(errorHandler);

// client-side handling of unknown routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
