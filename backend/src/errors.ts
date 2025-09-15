export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.statusCode = 400;
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.statusCode = 401;
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.statusCode = 404;
    this.name = "UnauthorizedError";
  }
}

export class DBInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DBInputError";
  }
}

export class DBUnexpectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DBUnexpectedError";
  }
}
