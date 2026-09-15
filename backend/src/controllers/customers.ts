import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  registerCustomer as registerCustomerService,
  loginCustomer as loginCustomerService,
  getCustomerProfile as getCustomerProfileService,
  getCustomerOrders as getCustomerOrdersService,
  updateCustomerProfile as updateCustomerProfileService,
  logoutCustomer as logoutCustomerService,
  listCustomersForAdmin,
  getCustomerForAdmin,
} from '../services/customerService';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Validation schemas
const customerRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
});

const customerLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const customerUpdateSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  phone: z.string().optional(),
});

/**
 * POST /api/customers/register
 * Register a new customer
 */
export const registerCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = customerRegistrationSchema.parse(req.body);

    const customer = await registerCustomerService({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      phone: validatedData.phone || null,
    });

    res.status(201).json({
      message: 'Customer registered successfully',
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return;
    }
    if (error instanceof Error && error.message === 'Customer with this email already exists') {
      res.status(409).json({ error: error.message });
      return;
    }
    next(error);
  }
};

/**
 * POST /api/customers/login
 * Login customer and set cookie
 */
export const loginCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = customerLoginSchema.parse(req.body);
    await loginCustomerService(req, res);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return;
    }
    next(error);
  }
};

/**
 * POST /api/customers/logout
 * Logout customer and clear cookie
 */
export const logoutCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await logoutCustomerService(req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/customers/profile
 * Get current customer profile
 */
export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await getCustomerProfileService(req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/customers/orders
 * Get customer order history
 */
export const getCustomerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await getCustomerOrdersService(req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/customers/profile
 * Update customer profile
 */
export const updateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = customerUpdateSchema.parse(req.body);
    await updateCustomerProfileService(req, res);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return;
    }
    next(error);
  }
};
/**
 * GET /api/customers
 * Admin: list customers
 */
export const listCustomers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(await listCustomersForAdmin());
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/customers/:id
 * Admin: customer detail with order history
 */
export const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const param = req.params.id;
    const id = Array.isArray(param) ? param[0] : param;
    if (!UUID_RE.test(id)) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    const customer = await getCustomerForAdmin(id);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
};
