import express from "express";
import usersRouter from "./routes/auth";
import todosRouter from "./routes/todos";
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

app.use("/api/auth", usersRouter);
app.use("/api/todos", todosRouter);

app.use(errorHandler);

// client-side handling of unknown routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
