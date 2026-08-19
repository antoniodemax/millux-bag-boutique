import { Router } from 'express';
import { createProduct, getProductById, getProducts, updateProduct, deleteProduct } from '../controllers/products';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductById);

// Protected routes (admin only)
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:slug', requireAuth, requireAdmin, updateProduct);
router.delete('/:slug', requireAuth, requireAdmin, deleteProduct);

export default router;