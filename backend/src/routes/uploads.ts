import { Router } from 'express';
import { uploadFile, getFile } from '../controllers/uploads';
import { requireAuth, requireAdmin } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

// Protected routes (admin only)
router.post('/', requireAuth, requireAdmin, upload.single('file'), uploadFile);
router.get('/:filename', getFile);

export default router;
