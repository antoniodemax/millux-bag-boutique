import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import {
  createOrder as createOrderService,
  getOrderById as getOrderByIdService,
  getOrders as getOrdersService,
  updateOrderStatus as updateOrderStatusService,
} from '../services/orderService';
import { z } from 'zod';

// Validation schemas
const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive('Quantity must be positive'),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).nonempty('At least one item is required'),
  whatsappMessage: z.string().optional(),
  customerId: z.string().optional(),
});

/**
 * GET /api/orders
 * Get orders with optional filtering (admin only in practice)
 */
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const status = (req.query.status as string | string[]);
    const customerId = (req.query.customerId as string | string[]);
    const startDate = (req.query.startDate as string | string[]);
    const endDate = (req.query.endDate as string | string[]);

    const statusValue = Array.isArray(status) ? status[0] : status;
    const customerIdValue = Array.isArray(customerId) ? customerId[0] : customerId;
    const startDateValue = startDate
      ? new Date(Array.isArray(startDate) ? startDate[0] : startDate)
      : undefined;
    const endDateValue = endDate
      ? new Date(Array.isArray(endDate) ? endDate[0] : endDate)
      : undefined;

    const filters = {
      status: statusValue as any,
      customerId: customerIdValue as string | undefined,
      startDate: startDateValue,
      endDate: endDateValue,
    };
    const orders = await getOrdersService(filters);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id
 * Get order by ID
 */
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    const order = await getOrderByIdService(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/orders
 * Create a new order
 */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = createOrderSchema.parse(req.body);

    const order = await createOrderService({
      items: validatedData.items,
      whatsappMessage: validatedData.whatsappMessage,
      customerId: (req as any).customer?.id ?? validatedData.customerId,
    });

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return;
    }
    next(error);
  }
};

/**
 * PATCH /api/orders/:id/status
 * Update order status (admin only)
 */
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ] as const;
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const order = await updateOrderStatusService(id, status);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};