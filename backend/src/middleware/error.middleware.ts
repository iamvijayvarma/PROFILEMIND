import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error(err.message || 'Error occurred', err);

  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return ApiResponse.error(res, 'Validation Error', 400, formattedErrors);
  }

  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message || 'Internal Server Error',
    500
  );
};
