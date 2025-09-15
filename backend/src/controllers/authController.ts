import { Request, Response } from "express";
import { createUserValidator } from "../validators/users";
import z from "zod";
import { BadRequestError, DBInputError, UnauthorizedError } from "../errors";
import {
  createUser as createDbUser,
  getUserByUsername,
} from "../db/queries/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser(req: Request, res: Response) {
  try {
    const { username, password } = createUserValidator.parse(req.body);
    const passwordHash = await bcrypt.hash(password, 10);

    const newUserData = { username, passwordHash };
    const user = await createDbUser(newUserData);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(201).json(user);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      throw new BadRequestError("Please provide a valid username and password");
    }
    if (err instanceof DBInputError) {
      throw new BadRequestError(err.message);
    }
    throw err;
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { username, password } = createUserValidator.parse(req.body);
    const existingUser = await getUserByUsername(username);
    const validCredentials =
      existingUser &&
      (await bcrypt.compare(password, existingUser.passwordHash));
    if (!validCredentials) {
      throw new BadRequestError("Invalid credentials");
    }
    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      message: "logged in",
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      throw new BadRequestError("Please provide a valid username and password");
    }

    throw err;
  }
}

export async function validateUser(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError("Unauthorized");
  }

  return res.status(200).json({
    user: req.user,
  });
}
