import { Router } from 'express';
import {
  getStats,
  getSalesOverview,
  getPaymentMix,
  getInventoryHealth,
} from '../controllers/dashboard';

const router = Router();

router.get('/stats', getStats);
router.get('/sales-overview', getSalesOverview);
router.get('/payment-mix', getPaymentMix);
router.get('/inventory-health', getInventoryHealth);

export default router;