import { Router } from 'express';
import { timelineController } from '../controllers/timeline.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, timelineController.getTimeline);

export default router;
