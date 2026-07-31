import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export class HealthController {
  checkHealth = (_req: Request, res: Response) => {
    return ApiResponse.success(
      res,
      {
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'ProfileMind Backend API',
        version: '1.0.0'
      },
      'Server health check passed'
    );
  };
}

export const healthController = new HealthController();
