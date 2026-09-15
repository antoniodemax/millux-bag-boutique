import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboardService';

/**
 * GET /api/dashboard/stats
 * @returns Dashboard statistics for KPI cards
 */
export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/sales-overview
 * @returns Sales data for the last 7 days
 */
export const getSalesOverview = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const overview = await dashboardService.getSalesOverview();
    res.json(overview);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/payment-mix
 * @returns Payment method distribution (placeholder)
 */
export const getPaymentMix = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const mix = await dashboardService.getPaymentMix();
    res.json(mix);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/inventory-health
 * @returns Inventory health counts
 */
export const getInventoryHealth = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await dashboardService.getInventoryHealth();
    res.json(health);
  } catch (error) {
    next(error);
  }
};
/**
 * GET /api/dashboard/analytics?days=30
 * @returns MVP analytics computed from real orders, order items and inventory
 */
export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const daysParam = Array.isArray(req.query.days) ? req.query.days[0] : req.query.days;
    const days = daysParam !== undefined ? parseInt(String(daysParam), 10) : undefined;
    if (daysParam !== undefined && (Number.isNaN(days) || (days as number) < 0)) {
      res.status(400).json({ error: 'days must be a non-negative integer' });
      return;
    }
    const analytics = await dashboardService.getAnalytics(days);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/recent-orders
 */
export const getRecentOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await dashboardService.getRecentOrders(5);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
