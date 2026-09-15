import pool, { query } from '../db/index';
import { Order, OrderItem, OrderItemWithProduct } from '../models/Order';
import { Product } from '../models/Product';

// Helper to convert database row to Order object
export interface OrderSummary extends Order {
  customer: { id: string; name: string | null; email: string | null; phone: string | null } | null;
  itemCount: number;
}

const mapToOrder = (row: any): OrderSummary => ({
  id: row.id,
  customerId: row.customerid ?? null,
  status: row.status as Order['status'],
  totalAmount: parseFloat(row.totalamount),
  whatsappMessage: row.whatsappmessage ?? null,
  createdAt: row.createdat,
  updatedAt: row.updatedat,
  customer: row.customer_id
    ? { id: row.customer_id, name: row.customer_name ?? null, email: row.customer_email ?? null, phone: row.customer_phone ?? null }
    : null,
  itemCount: row.item_count !== undefined && row.item_count !== null ? parseInt(row.item_count, 10) : 0,
});

const ORDER_SELECT = `
  SELECT o.*,
         c.id AS customer_id, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone,
         (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.orderid = o.id) AS item_count
  FROM orders o
  LEFT JOIN customers c ON c.id = o.customerid
`;

// Helper to convert database row to OrderItem object
const mapToOrderItem = (row: any): OrderItem => ({
  id: row.id,
  orderId: row.orderid,
  productId: row.productid,
  quantity: parseInt(row.quantity),
  priceAtPurchase: parseFloat(row.priceatpurchase),
  createdAt: row.createdat,
});

/**
 * Create a new order with items
 * Also deducts inventory and records inventory movements
 */
export const createOrder = async (
  orderData: {
    items: { productId: string; quantity: number }[];
    whatsappMessage?: string;
    customerId?: string;
  }
): Promise<OrderSummary> => {
  const { items, whatsappMessage = null, customerId = null } = orderData;

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Merge duplicate product lines
  const merged = new Map<string, number>();
  for (const item of items) {
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }

  const client = await pool.connect();
  let orderId: string;
  try {
    await client.query('BEGIN');

    let totalAmount = 0;
    const lines: { productId: string; quantity: number; price: number }[] = [];

    for (const [productId, quantity] of merged) {
      const productResult = await client.query(
        `SELECT p.id, p.name, p.price, COALESCE(i.quantity, 0) AS stock
         FROM products p
         LEFT JOIN inventory i ON i.productid = p.id
         WHERE p.id = $1
         FOR UPDATE OF p`,
        [productId]
      );
      if (productResult.rows.length === 0) {
        throw Object.assign(new Error(`Product not found: ${productId}`), { statusCode: 404 });
      }
      const product = productResult.rows[0];
      const stock = parseInt(product.stock, 10);
      if (stock < quantity) {
        throw Object.assign(new Error(`Insufficient stock for product: ${product.name}`), { statusCode: 409 });
      }
      const price = parseFloat(product.price);
      lines.push({ productId, quantity, price });
      totalAmount += price * quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (customerid, status, totalamount, whatsappmessage)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [customerId, 'pending', totalAmount, whatsappMessage]
    );
    orderId = orderResult.rows[0].id;

    for (const line of lines) {
      await client.query(
        `INSERT INTO order_items (orderid, productid, quantity, priceatpurchase)
         VALUES ($1, $2, $3, $4)`,
        [orderId, line.productId, line.quantity, line.price]
      );
      await client.query(
        `UPDATE inventory
         SET quantity = quantity - $1, updatedat = CURRENT_TIMESTAMP
         WHERE productid = $2`,
        [line.quantity, line.productId]
      );
      await client.query(
        `INSERT INTO inventory_movements (productid, change, reason, referenceid)
         VALUES ($1, $2, $3, $4)`,
        [line.productId, -line.quantity, 'order', orderId]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  const finalOrderResult = await query(`${ORDER_SELECT} WHERE o.id = $1`, [orderId]);
  return mapToOrder(finalOrderResult.rows[0]);
};

/**
 * Get order by ID with items and product details
 */
export const getOrderById = async (id: string): Promise<(OrderSummary & { items: OrderItemWithProduct[] }) | null> => {
  // Fetch the order
  const orderResult = await query(`${ORDER_SELECT} WHERE o.id = $1`, [id]);
  if (orderResult.rows.length === 0) return null;

  const order = mapToOrder(orderResult.rows[0]);

  // Fetch order items with product details
  const itemsResult = await query(
    `SELECT oi.*, p.id as "productId", p.slug, p.name, p.category, p.price,
            p.images, p.description, p.materials, p.dimensions, p.care,
            p.availability, p.featured, p.newarrival, p.bestseller, p.createdat as "productCreatedAt", p.updatedat as "productUpdatedAt"
     FROM order_items oi
     JOIN products p ON oi.productid = p.id
     WHERE oi.orderid = $1`,
    [id]
  );

  const items = itemsResult.rows.map((row: any) => ({
    id: row.id,
    orderId: row.orderid,
    productId: row.productid,
    quantity: parseInt(row.quantity),
    priceAtPurchase: parseFloat(row.priceatpurchase),
    createdAt: row.createdat,
    product: {
      id: row.productId,
      slug: row.slug,
      name: row.name,
      category: row.category,
      price: parseFloat(row.price),
      images: Array.isArray(row.images) ? row.images : [],
      description: row.description,
      materials: row.materials,
      dimensions: row.dimensions,
      care: row.care,
      availability: row.availability as Product['availability'],
      featured: row.featured,
      newArrival: row.newarrival,
      bestseller: row.bestseller,
      createdAt: row.productCreatedAt,
      updatedAt: row.productUpdatedAt
    }
  }));

  return { ...order, items };
};

/**
 * Get orders with optional filtering
 */
export const getOrders = async (
  filters: {
    status?: Order['status'];
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}
): Promise<OrderSummary[]> => {
  let queryStr = ORDER_SELECT;
  const params: any[] = [];
  const conditions: string[] = [];

  if (filters.status !== undefined) {
    conditions.push('o.status = $' + (params.length + 1));
    params.push(filters.status);
  }
  if (filters.customerId !== undefined) {
    conditions.push('o.customerid = $' + (params.length + 1));
    params.push(filters.customerId);
  }
  if (filters.startDate !== undefined) {
    conditions.push('o.createdat >= $' + (params.length + 1));
    params.push(filters.startDate);
  }
  if (filters.endDate !== undefined) {
    conditions.push('o.createdat <= $' + (params.length + 1));
    params.push(filters.endDate);
  }

  if (conditions.length > 0) {
    queryStr += ' WHERE ' + conditions.join(' AND ');
  }

  queryStr += ' ORDER BY o.createdat DESC';

  const result = await query(queryStr, params);
  return result.rows.map(mapToOrder);
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  id: string,
  status: Order['status']
): Promise<OrderSummary | null> => {
  const result = await query(
    `UPDATE orders
     SET status = $1, updatedat = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id`,
    [status, id]
  );
  if (result.rows.length === 0) return null;
  const refreshed = await query(`${ORDER_SELECT} WHERE o.id = $1`, [id]);
  return mapToOrder(refreshed.rows[0]);
};

export { mapToOrder, mapToOrderItem };