import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orders';
import { requireAdmin } from '../middleware/auth';
import { requireAuth as requireCustomerAuth } from '../middleware/customerAuth';

const router = Router();

// Customer routes
router.post('/', requireCustomerAuth, createOrder);

// Admin routes
router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderById);
router.patch('/:id/status', requireAuth, updateOrderStatus);

export default router;