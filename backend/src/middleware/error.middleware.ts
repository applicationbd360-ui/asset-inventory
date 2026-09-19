import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { isDev } from '../config';

export { AppError };

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        ...(isDev && { stack: err.stack }),
      },
    });
  }

  // Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;

    if (prismaErr.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Duplicate entry — record already exists',
          code: 'DUPLICATE_ENTRY',
          field: prismaErr.meta?.target,
        },
      });
    }

    if (prismaErr.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Record not found',
          code: 'NOT_FOUND',
        },
      });
    }
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    const zodErr = err as any;
    return res.status(422).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: zodErr.errors,
      },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid token', code: 'INVALID_TOKEN' },
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: {
      message: isDev ? err.message : 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(isDev && { stack: err.stack }),
    },
  });
};
