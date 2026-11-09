import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    res.status(400).json({
      message: firstIssue?.message ?? 'Dados inválidos enviados na requisição.',
      issues: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  console.error('[InternalError]', error);
  res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}
