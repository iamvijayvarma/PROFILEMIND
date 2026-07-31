import { Request, Response, NextFunction } from 'express';
import { novaService } from '../services/nova.service';
import { ApiResponse } from '../utils/apiResponse';

export class NovaController {
  chat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { message } = req.body;
      const result = await novaService.processChatMessage(userId, message);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export const novaController = new NovaController();
