import { Request, Response, NextFunction } from 'express';
import { authenticateCustomer, requireCustomerAuth as requireCustomerAuthService, optionalCustomerAuth as optionalCustomerAuthService } from '../services/customerService';

/**
 * Authentication middleware - ensures customer is logged in
 */
export const requireCustomerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await authenticateCustomer(req, res, next);
};

/**
 * Authorization middleware - ensures customer is authenticated
 * (alias for requireCustomerAuth for clarity in routes)
 */
export const requireAuth = requireCustomerAuth; // Same function, different name for route clarity

/**
 * Optional authentication - attaches customer if authenticated, continues anyway if not
 */
export const optionalCustomerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await optionalCustomerAuthService(req, res, next);
};