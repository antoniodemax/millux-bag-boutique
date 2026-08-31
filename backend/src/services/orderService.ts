import { query } from '../db/index';
import { Order, OrderItem, OrderItemWithProduct } from '../models/Order';
import { Product } from '../models/Product';

// Helper to convert database row to Order object
const mapToOrder = (row: any): Order => ({
  id: row.id,
  customerId: row.customerid ?? null,
  status: row.status as Order['status'],
  totalAmount: parseFloat(row.totalamount),
  whatsappMessage: row.whatsappmessage ?? null,
  createdAt: row.createdat,
  updatedAt: row.updatedat,
});

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
): Promise<Order> => {
  const { items, whatsappMessage = null, customerId = null } = orderData;

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Validate each product exists and has sufficient inventory
  for (const item of items) {
    const productResult = await query(
      'SELECT * FROM products WHERE id = $1',
      [item.productId]
    );
    if (productResult.rows.length === 0) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    const product = productResult.rows[0] as Product;
    const inventoryResult = await query(
      'SELECT quantity FROM inventory WHERE productid = $1',
      [item.productId]
    );
    const inventoryQuantity = inventoryResult.rows.length > 0
      ? parseInt(inventoryResult.rows[0].quantity)
      : 0;
    if (inventoryQuantity < item.quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }
  }

  // Calculate total amount
  let totalAmount = 0;
  const productPrices: { [productId: string]: number } = {};
  for (const item of items) {
    const productResult = await query(
      'SELECT price FROM products WHERE id = $1',
      [item.productId]
    );
    const price = parseFloat(productResult.rows[0].price);
    productPrices[item.productId] = price;
    totalAmount += price * item.quantity;
  }

  // Insert order
  const orderResult = await query(
    `INSERT INTO orders (
      customerid, status, totalamount, whatsappmessage
    ) VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [
      customerId,
      'pending',
      totalAmount,
      whatsappMessage
    ]
  );

  const order = mapToOrder(orderResult.rows[0]);

  // Insert order items and update inventory
  for (const item of items) {
    // Insert order_item
    await query(
      `INSERT INTO order_items (
        orderid, productid, quantity, priceatpurchase
      ) VALUES ($1, $2, $3, $4)`,
      [
        order.id,
        item.productId,
        item.quantity,
        productPrices[item.productId]
      ]
    );

    // Update inventory: decrement quantity
    await query(
      `UPDATE inventory
       SET quantity = quantity - $1, updatedat = CURRENT_TIMESTAMP
       WHERE productid = $2`,
      [item.quantity, item.productId]
    );

    // Record inventory movement (outgoing)
    await query(
      `INSERT INTO inventory_movements (
        productid, change, reason, referenceid
      ) VALUES ($1, $2, $3, $4)`,
      [
        item.productId,
        -item.quantity,
        'order',
        order.id
      ]
    );
  }

  // Fetch the order again to ensure we have the latest data (optional)
  const finalOrderResult = await query(
    'SELECT * FROM orders WHERE id = $1',
    [order.id]
  );
  return mapToOrder(finalOrderResult.rows[0]);
};

/**
 * Get order by ID with items and product details
 */
export const getOrderById = async (id: string): Promise<(Order & { items: OrderItemWithProduct[] }) | null> => {
  console.log('getOrderById called with id:', id);

  // Fetch the order
  const orderResult = await query('SELECT * FROM orders WHERE id = $1', [id]);
  console.log('query result rows:', orderResult.rows);
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
      images: row.images ? JSON.parse(row.images) : [],
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
): Promise<Order[]> => {
  let queryStr = 'SELECT * FROM orders';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filters.status !== undefined) {
    conditions.push('status = $' + (params.length + 1));
    params.push(filters.status);
  }
  if (filters.customerId !== undefined) {
    conditions.push('customerid = $' + (params.length + 1));
    params.push(filters.customerId);
  }
  if (filters.startDate !== undefined) {
    conditions.push('createdat >= $' + (params.length + 1));
    params.push(filters.startDate);
  }
  if (filters.endDate !== undefined) {
    conditions.push('createdat <= $' + (params.length + 1));
    params.push(filters.endDate);
  }

  if (conditions.length > 0) {
    queryStr += ' WHERE ' + conditions.join(' AND ');
  }

  queryStr += ' ORDER BY createdat DESC';

  const result = await query(queryStr, params);
  return result.rows.map(mapToOrder);
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  id: string,
  status: Order['status']
): Promise<Order | null> => {
  const result = await query(
    `UPDATE orders
     SET status = $1, updatedat = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  if (result.rows.length === 0) return null;
  return mapToOrder(result.rows[0]);
};

export { mapToOrder, mapToOrderItem };