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
     FROM inventory i
     WHERE i.quantity < 5`
  );
  const lowStock = parseInt(lowStockResult.rows[0].count) || 0;

  // Open Registers: count of orders with status 'pending' or 'processing'
  const openRegistersResult = await query(
    `SELECT COUNT(*) as count
     FROM orders
     WHERE status = 'pending' OR status = 'processing'`
  );
  const openRegisters = parseInt(openRegistersResult.rows[0].count) || 0;

  return {
    todaySales,
    todayItems,
    lowStock,
    openRegisters,
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
  const result = await query(
    `SELECT
        SUM(CASE WHEN i.quantity = 0 THEN 1 ELSE 0 END) as outOfStock,
        SUM(CASE WHEN i.quantity > 0 AND i.quantity <= 5 THEN 1 ELSE 0 END) as lowStock,
        SUM(CASE WHEN i.quantity > 5 THEN 1 ELSE 0 END) as inStock
     FROM inventory i`
  );
  const row = result.rows[0];
  return {
    outOfStock: parseInt(row.outOfStock) || 0,
    lowStock: parseInt(row.lowStock) || 0,
    inStock: parseInt(row.inStock) || 0,
  };
};