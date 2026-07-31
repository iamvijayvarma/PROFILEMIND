import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const updateProfileSchema = z.object({
  body: z.object({
    headline: z.string().optional(),
    bio: z.string().max(250, 'Bio must be under 250 characters').optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    dob: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
    preferredRole: z.string().optional(),
    skills: z.array(z.string()).optional(),
    avatarUrl: z.string().optional()
  })
});

router.get('/', authenticate, profileController.getProfile);
router.put('/', authenticate, validate(updateProfileSchema), profileController.updateProfile);

export default router;
