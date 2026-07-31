import { Router } from 'express';
import { documentController } from '../controllers/document.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), documentController.uploadDocument);
router.get('/', authenticate, documentController.getDocuments);
router.get('/:id', authenticate, documentController.getDocumentById);
router.delete('/:id', authenticate, documentController.deleteDocument);

export default router;
