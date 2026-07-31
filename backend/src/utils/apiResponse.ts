import { Response } from 'express';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data
    });
  }

  static error(
    res: Response,
    message = 'Internal Server Error',
    statusCode = 500,
    errors: any[] = []
  ): Response {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: errors.length > 0 ? errors : undefined
    });
  }
}
