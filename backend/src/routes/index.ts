import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import documentRoutes from './document.routes';
import timelineRoutes from './timeline.routes';
import novaRoutes from './nova.routes';
import healthRoutes from './health.routes';

const router = Router();

// Mounting API routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/documents', documentRoutes);
router.use('/timeline', timelineRoutes);
router.use('/nova', novaRoutes);
router.use('/health', healthRoutes);

export default router;
