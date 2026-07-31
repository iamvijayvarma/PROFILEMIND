import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';
import { ApiResponse } from '../utils/apiResponse';

export class ProfileController {
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const profile = await profileService.getProfile(userId);
      return ApiResponse.success(res, profile, 'Profile baseline retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const updatedProfile = await profileService.updateProfile(userId, req.body);
      return ApiResponse.success(res, updatedProfile, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const profileController = new ProfileController();
