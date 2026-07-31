import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const syncSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    fullName: z.string().min(1, 'Full name is required'),
    avatarUrl: z.string().url().optional().or(z.literal(''))
  })
});

router.post('/sync', authenticate, validate(syncSchema), authController.sync);
router.get('/me', authenticate, authController.getMe);

export default router;
