import { Router } from 'express';
import {
  getStats,
  getSalesOverview,
  getPaymentMix,
  getInventoryHealth,
  getAnalytics,
  getRecentOrders,
} from '../controllers/dashboard';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// All dashboard data is admin-only
router.use(requireAuth, requireAdmin);

router.get('/stats', getStats);
router.get('/sales-overview', getSalesOverview);
router.get('/payment-mix', getPaymentMix);
router.get('/inventory-health', getInventoryHealth);
router.get('/analytics', getAnalytics);
router.get('/recent-orders', getRecentOrders);

export default router;