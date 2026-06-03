import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.statusCode ?? 500;
  const message = err.message ?? 'Internal server error';
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
}
