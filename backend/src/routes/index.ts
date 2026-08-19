import { Router } from 'express';
import authRouter from './auth';
import productsRouter from './products';
import categoriesRouter from './categories';
import uploadsRouter from './uploads';
import dashboardRouter from './dashboard';

const router = Router();

// Health check is already in app.ts
router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/uploads', uploadsRouter);
router.use('/dashboard', dashboardRouter);

export function registerRoutes(app: any) {
  app.use('/api', router);
}

export default router;
