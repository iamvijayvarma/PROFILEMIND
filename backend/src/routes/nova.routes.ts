import { Router } from 'express';
import { novaController } from '../controllers/nova.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty')
  })
});

router.post('/chat', authenticate, validate(chatSchema), novaController.chat);

export default router;
