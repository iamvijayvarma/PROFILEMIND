import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

export class AuthController {
  sync = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { email, fullName, avatarUrl } = req.body;
      const result = await authService.syncUser({ id: userId, email, fullName, avatarUrl });
      return ApiResponse.success(res, result, 'User profile synced successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const user = await authService.getMe(userId);
      return ApiResponse.success(res, user, 'User profile fetched successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
