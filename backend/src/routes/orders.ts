import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orders';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public routes (for now, we'll protect later if needed)
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;