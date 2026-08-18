import { Request, Response, NextFunction } from 'express';
import { authenticate, authorizeAdmin } from '../services/authService';

/**
 * Authentication middleware - ensures user is logged in
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await authenticate(req, res, next);
};

/**
 * Authorization middleware - ensures user is admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  authorizeAdmin(req, res, next);
};

/**
 * Optional authentication - attaches user if authenticated, continues anyway if not
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authenticate(req, res, () => {
      next();
    });
  } catch (err) {
    // If authentication fails, continue without user
    next();
  }
};
