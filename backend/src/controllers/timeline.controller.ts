import { Request, Response, NextFunction } from 'express';
import { timelineService } from '../services/timeline.service';
import { ApiResponse } from '../utils/apiResponse';

export class TimelineController {
  getTimeline = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const events = await timelineService.getTimelineEvents(userId);
      return ApiResponse.success(res, events, 'Timeline milestone events retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const timelineController = new TimelineController();
