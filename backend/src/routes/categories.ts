import { Router } from 'express';
import { createCategory, getCategoryById, getCategories, updateCategory, deleteCategory } from '../controllers/categories';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected routes (admin only)
router.post('/', requireAuth, requireAdmin, createCategory);
router.put('/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

export default router;
