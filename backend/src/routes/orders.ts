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
router.get('/', requireAdmin, getOrders);
router.get('/:id', requireAdmin, getOrderById);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

export default router;