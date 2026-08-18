import { Router } from 'express';
import { createProduct, getProductById, getProducts, updateProduct, deleteProduct } from '../controllers/products';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (admin only)
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
