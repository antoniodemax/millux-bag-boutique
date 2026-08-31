import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { query } from '../db/index';
import { config } from '../config';
import { Request, Response, NextFunction } from 'express';

// Customer interface (without sensitive data)
// Matches database schema exactly
export interface Customer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Customer registration data
export interface CustomerRegistration {
  email: string;
  password: string;
  name: string;
  phone: string | null;
}

// Customer login credentials
export interface CustomerLoginCredentials {
  email: string;
  password: string;
}

/**
 * Register a new customer
 */
export const registerCustomer = async (
  customerData: CustomerRegistration
): Promise<Customer> => {
  const { email, password, name, phone } = customerData;

  // Validate required fields
  if (!email || !password || !name) {
    throw new Error('Email, password, and name are required');
  }

  // Check if customer already exists
  const existingCustomer = await query(
    'SELECT * FROM customers WHERE email = $1',
    [email]
  );

  if (existingCustomer.rows.length > 0) {
    throw new Error('Customer with this email already exists');
  }

  // Hash password
  const passwordHash = await hash(password, 12);

  // Insert customer
  const result = await query(
    `INSERT INTO customers (email, password_hash, name, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, phone, createdAt, updatedAt`,
    [email, passwordHash, name, phone ?? null]
  );

  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    name: result.rows[0].name,
    phone: result.rows[0].phone,
    createdAt: result.rows[0].createdAt,
    updatedAt: result.rows[0].updatedAt,
  };
};

/**
 * Find customer by email
 */
export const findCustomerByEmail = async (
  email: string
): Promise<{
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  password_hash: string;
  createdAt: Date;
  updatedAt: Date;
} | null> => {
  const result = await query('SELECT * FROM customers WHERE email = $1', [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Validate customer password
 */
export const validateCustomerPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return compare(password, hash);
};

/**
 * Generate JWT token for customer
 */
export const generateCustomerToken = (customer: Customer): string => {
  return sign(
    { customerId: customer.id, email: customer.email || '' },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

/**
 * Authenticate customer via JWT token and attach to request
 */
export const authenticateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const decoded = verify(token, config.jwtSecret) as {
      customerId: string;
      email: string;
    };
    const customerRecord = await findCustomerByEmail(decoded.email);

    if (!customerRecord) {
      res.status(401).json({ error: 'Customer not found' });
      return;
    }

    // Validate token belongs to this customer
    if (customerRecord.id !== decoded.customerId) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Attach customer to request for downstream use
    (req as any).customer = {
      id: customerRecord.id,
      email: customerRecord.email,
      name: customerRecord.name,
      phone: customerRecord.phone,
      createdAt: customerRecord.createdAt,
      updatedAt: customerRecord.updatedAt,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

/**
 * Authorization middleware - check if customer is authenticated
 */
export const requireCustomerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await authenticateCustomer(req, res, next);
};

/**
 * Optional authentication - attaches customer if authenticated, continues anyway if not
 */
export const optionalCustomerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authenticateCustomer(req, res, () => {
      next();
    });
  } catch (err) {
    // If authentication fails, continue without customer
    next();
  }
};

/**
 * Login customer and set cookie
 */
export const loginCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body as CustomerLoginCredentials;
  const customerRecord = await findCustomerByEmail(email);

  if (!customerRecord) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const isValid = await validateCustomerPassword(
    password,
    customerRecord.password_hash
  );

  if (!isValid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const customer: Customer = {
    id: customerRecord.id,
    email: customerRecord.email,
    name: customerRecord.name,
    phone: customerRecord.phone,
    createdAt: customerRecord.createdAt,
    updatedAt: customerRecord.updatedAt,
  };

  const token = generateCustomerToken(customer);

  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    message: 'Logged in successfully',
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
    },
  });
};

/**
 * Logout customer by clearing cookie
 */
export const logoutCustomer = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

/**
 * Get current customer
 */
export const getCustomerProfile = (
  req: Request,
  res: Response
): void => {
  const customer = (req as any).customer;
  if (!customer) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({ customer });
};

/**
 * Get customer order history
 */
export const getCustomerOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customerId = (req as any).customer?.id;
  if (!customerId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    // Get orders with line items and product details
    const ordersResult = await query(
      `SELECT o.id, o.status, o.totalAmount, o.whatsappMessage, o.createdAt, o.updatedAt,
              oi.id as "orderItemId", oi.quantity, oi.priceatpurchase,
              p.id as "productId", p.slug, p.name as "productName", p.price, p.images,
              p.description, p.materials, p.dimensions, p.care, p.availability,
              p.featured, p.newarrival, p.bestseller
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.orderid
       LEFT JOIN products p ON oi.productid = p.id
       WHERE o.customerid = $1
       ORDER BY o.createdat DESC`,
      [customerId]
    );

    // Group order items by order
    const ordersMap = new Map<string, any>();

    ordersResult.rows.forEach((row: any) => {
      const orderId = row.id;
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: row.id,
          status: row.status,
          totalAmount: parseFloat(row.totalamount),
          whatsappMessage: row.whatsappmessage,
          createdAt: row.createdat,
          updatedAt: row.updatedat,
          items: []
        });
      }

      // Add order item if it exists
      if (row.orderItemId) {
        const orderItem = {
          id: row.orderItemId,
          quantity: parseInt(row.quantity),
          priceAtPurchase: parseFloat(row.priceatpurchase),
          product: {
            id: row.productId,
            slug: row.slug,
            name: row.productName,
            price: parseFloat(row.price),
            images: row.images ? JSON.parse(row.images) : [],
            description: row.description,
            materials: row.materials,
            dimensions: row.dimensions,
            care: row.care,
            availability: row.availability,
            featured: row.featured,
            newArrival: row.newarrival,
            bestseller: row.bestseller,
          }
        };

        const order = ordersMap.get(orderId);
        order.items.push(orderItem);
      }
    });

    const orders = Array.from(ordersMap.values());
    res.json(orders);
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ error: 'Failed to retrieve order history' });
  }
};

/**
 * Update customer profile
 */
export const updateCustomerProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customerId = (req as any).customer?.id;
  if (!customerId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const { name, phone } = req.body;

  // Build update object dynamically
  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: 'No valid fields to update' });
    return;
  }

  // Add updatedAt timestamp
  updates.updatedAt = new Date();

  // Build SET clause dynamically
  const setClause = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const values = Object.values(updates);
  values.push(customerId); // for WHERE clause

  try {
    const result = await query(
      `UPDATE customers
       SET ${setClause}, updatedat = CURRENT_TIMESTAMP
       WHERE id = $${values.length}
       RETURNING id, email, name, phone, createdat, updatedat`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const updatedCustomer = {
      id: result.rows[0].id,
      email: result.rows[0].email,
      name: result.rows[0].name,
      phone: result.rows[0].phone,
      createdAt: result.rows[0].createdat,
      updatedAt: result.rows[0].updatedat,
    };

    res.json({
      message: 'Profile updated successfully',
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};