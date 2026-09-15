import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orders';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { requireAuth as requireCustomerAuth } from '../middleware/customerAuth';

const router = Router();

// Customer routes
router.post('/', requireCustomerAuth, createOrder);

// Admin routes
router.get('/', requireAuth, requireAdmin, getOrders);
router.get('/:id', requireAuth, requireAdmin, getOrderById);
router.patch('/:id/status', requireAuth, requireAdmin, updateOrderStatus);

export default router;