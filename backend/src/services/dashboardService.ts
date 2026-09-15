import { query } from '../db/index';

/**
 * Get dashboard statistics for KPI cards
 */
export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Today's Sales: sum of totalAmount from orders created today
  const todaySalesResult = await query(
    `SELECT COALESCE(SUM(totalAmount), 0) as total
     FROM orders
     WHERE createdAt >= $1 AND createdAt < $2`,
    [today, tomorrow]
  );
  const todaySales = parseFloat(todaySalesResult.rows[0].total) || 0;

  // Items Sold Today: sum of quantity from order_items joined with orders from today
  const todayItemsResult = await query(
    `SELECT COALESCE(SUM(oi.quantity), 0) as total
     FROM order_items oi
     JOIN orders o ON oi.orderId = o.id
     WHERE o.createdAt >= $1 AND o.createdAt < $2`,
    [today, tomorrow]
  );
  const todayItems = parseInt(todayItemsResult.rows[0].total) || 0;

  // Low Stock Items: count of products with inventory quantity < 5
  const lowStockResult = await query(
    `SELECT COUNT(*) as count
     FROM products p
     LEFT JOIN inventory i ON i.productid = p.id
     WHERE COALESCE(i.quantity, 0) <= 5`
  );
  const lowStock = parseInt(lowStockResult.rows[0].count) || 0;

  // Open Registers: count of orders with status 'pending' or 'processing'
  const openRegistersResult = await query(
    `SELECT COUNT(*) as count
     FROM orders
     WHERE status = 'pending' OR status = 'processing'`
  );
  const openRegisters = parseInt(openRegistersResult.rows[0].count) || 0;

  const totalsResult = await query(
    `SELECT COALESCE(SUM(CASE WHEN status <> 'cancelled' THEN totalamount ELSE 0 END), 0) AS revenue,
            COUNT(*) AS orders
     FROM orders`
  );
  const productCountResult = await query('SELECT COUNT(*) AS count FROM products');

  return {
    todaySales,
    todayItems,
    lowStock,
    openRegisters,
    openOrders: openRegisters,
    totalRevenue: parseFloat(totalsResult.rows[0].revenue) || 0,
    totalOrders: parseInt(totalsResult.rows[0].orders, 10) || 0,
    productCount: parseInt(productCountResult.rows[0].count, 10) || 0,
  };
};

/**
 * Get sales overview for the last 7 days
 */
export const getSalesOverview = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today, so 7 days total
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const result = await query(
    `SELECT
        TO_CHAR(o.createdAt, 'YYYY-MM-DD') as day,
        COALESCE(SUM(o.totalAmount), 0) as total
     FROM orders o
     WHERE o.createdAt >= $1 AND o.createdAt < $2
     GROUP BY day
     ORDER BY day`,
    [sevenDaysAgo, endDate]
  );

  // Ensure we have 7 days, fill missing days with 0
  const salesMap = new Map<string, number>();
  result.rows.forEach(row => {
    salesMap.set(row.day, parseFloat(row.total));
  });

  const salesOverview: { day: string; total: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); // i=0 -> 6 days ago, i=6 -> today
    date.setHours(0, 0, 0, 0);
    const dayStr = date.toISOString().split('T')[0];
    const total = salesMap.get(dayStr) || 0;
    salesOverview.push({ day: dayStr, total });
  }

  return salesOverview;
};

/**
 * Get payment mix (placeholder - to be implemented when payment methods are added)
 */
export const getPaymentMix = async () => {
  // Placeholder: return empty array until payment method field exists in orders
  return [];
};

/**
 * Get inventory health
 */
export const getInventoryHealth = async () => {
  // Products without an inventory row count as out of stock
  const result = await query(
    `SELECT
        SUM(CASE WHEN COALESCE(i.quantity, 0) = 0 THEN 1 ELSE 0 END) AS "outOfStock",
        SUM(CASE WHEN COALESCE(i.quantity, 0) > 0 AND COALESCE(i.quantity, 0) <= 5 THEN 1 ELSE 0 END) AS "lowStock",
        SUM(CASE WHEN COALESCE(i.quantity, 0) > 5 THEN 1 ELSE 0 END) AS "inStock"
     FROM products p
     LEFT JOIN inventory i ON i.productid = p.id`
  );
  const row = result.rows[0];
  return {
    outOfStock: parseInt(row.outOfStock) || 0,
    lowStock: parseInt(row.lowStock) || 0,
    inStock: parseInt(row.inStock) || 0,
  };
};

/**
 * MVP analytics: revenue, order volume, units sold, best sellers, stock summary.
 * Revenue excludes cancelled orders. Optional `days` limits the window (default: all time).
 */
export const getAnalytics = async (days?: number) => {
  const params: any[] = [];
  let since: Date | null = null;
  if (days && days > 0) {
    since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);
    params.push(since);
  }
  const dateFilter = since ? 'AND o.createdat >= $1' : '';

  const totalsResult = await query(
    `SELECT
        COALESCE(SUM(CASE WHEN o.status <> 'cancelled' THEN o.totalamount ELSE 0 END), 0) AS revenue,
        COUNT(*) AS "orderCount",
        COUNT(*) FILTER (WHERE o.status <> 'cancelled') AS "activeOrderCount",
        COALESCE(AVG(CASE WHEN o.status <> 'cancelled' THEN o.totalamount END), 0) AS "averageOrderValue"
     FROM orders o
     WHERE TRUE ${dateFilter}`,
    params
  );

  const unitsResult = await query(
    `SELECT COALESCE(SUM(oi.quantity), 0) AS units
     FROM order_items oi
     JOIN orders o ON o.id = oi.orderid
     WHERE o.status <> 'cancelled' ${dateFilter}`,
    params
  );

  const statusResult = await query(
    `SELECT o.status, COUNT(*) AS count
     FROM orders o
     WHERE TRUE ${dateFilter}
     GROUP BY o.status`,
    params
  );

  const bestSellersResult = await query(
    `SELECT p.id, p.slug, p.name, p.category, p.images,
            SUM(oi.quantity) AS "unitsSold",
            SUM(oi.quantity * oi.priceatpurchase) AS revenue
     FROM order_items oi
     JOIN orders o ON o.id = oi.orderid
     JOIN products p ON p.id = oi.productid
     WHERE o.status <> 'cancelled' ${dateFilter}
     GROUP BY p.id, p.slug, p.name, p.category, p.images
     ORDER BY "unitsSold" DESC, revenue DESC
     LIMIT 5`,
    params
  );

  const inventoryResult = await query(
    `SELECT COUNT(*) AS "productCount",
            COALESCE(SUM(COALESCE(i.quantity, 0)), 0) AS "unitsInStock",
            COALESCE(SUM(COALESCE(i.quantity, 0) * p.price), 0) AS "stockValue"
     FROM products p
     LEFT JOIN inventory i ON i.productid = p.id`
  );

  const lowStockResult = await query(
    `SELECT p.id, p.slug, p.name, COALESCE(i.quantity, 0) AS stock
     FROM products p
     LEFT JOIN inventory i ON i.productid = p.id
     WHERE COALESCE(i.quantity, 0) <= 5
     ORDER BY stock ASC, p.name ASC
     LIMIT 10`
  );

  const customerResult = await query(`SELECT COUNT(*) AS count FROM customers`);

  const totals = totalsResult.rows[0];
  const ordersByStatus: Record<string, number> = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
  statusResult.rows.forEach((row: any) => { ordersByStatus[row.status] = parseInt(row.count, 10); });

  return {
    period: days && days > 0 ? { days, since } : { days: null, since: null },
    revenue: parseFloat(totals.revenue) || 0,
    orderCount: parseInt(totals.orderCount, 10) || 0,
    activeOrderCount: parseInt(totals.activeOrderCount, 10) || 0,
    averageOrderValue: parseFloat(totals.averageOrderValue) || 0,
    unitsSold: parseInt(unitsResult.rows[0].units, 10) || 0,
    customerCount: parseInt(customerResult.rows[0].count, 10) || 0,
    ordersByStatus,
    bestSellers: bestSellersResult.rows.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      image: Array.isArray(row.images) && row.images.length > 0 ? row.images[0] : null,
      unitsSold: parseInt(row.unitsSold, 10) || 0,
      revenue: parseFloat(row.revenue) || 0,
    })),
    inventory: {
      productCount: parseInt(inventoryResult.rows[0].productCount, 10) || 0,
      unitsInStock: parseInt(inventoryResult.rows[0].unitsInStock, 10) || 0,
      stockValue: parseFloat(inventoryResult.rows[0].stockValue) || 0,
      lowStock: lowStockResult.rows.map((row: any) => ({
        id: row.id, slug: row.slug, name: row.name, stock: parseInt(row.stock, 10) || 0,
      })),
    },
  };
};

/**
 * Most recent orders for the dashboard
 */
export const getRecentOrders = async (limit = 5) => {
  const result = await query(
    `SELECT o.id, o.status, o.totalamount, o.createdat,
            c.name AS customer_name, c.email AS customer_email,
            (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.orderid = o.id) AS item_count
     FROM orders o
     LEFT JOIN customers c ON c.id = o.customerid
     ORDER BY o.createdat DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows.map((row: any) => ({
    id: row.id,
    status: row.status,
    totalAmount: parseFloat(row.totalamount) || 0,
    createdAt: row.createdat,
    customerName: row.customer_name ?? null,
    customerEmail: row.customer_email ?? null,
    itemCount: parseInt(row.item_count, 10) || 0,
  }));
};