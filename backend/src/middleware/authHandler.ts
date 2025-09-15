import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors";

export function authHandler(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        username: string;
        id: number;
      };

      req.user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedError("Invalid token");
    }
  } else {
    next();
  }
}
