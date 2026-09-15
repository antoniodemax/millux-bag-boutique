import pool, { query } from '../db/index';
import { Product } from '../models/Product';

export interface ProductWithStock extends Product {
  stock: number;
}

// Helper to convert database row to Product object
const mapToProduct = (row: any): ProductWithStock => ({
  id: row.id,
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
  stock: row.stock === null || row.stock === undefined ? 0 : parseInt(row.stock, 10),
  createdAt: row.createdat,
  updatedAt: row.updatedat,
});

// Products always come back with their inventory quantity as `stock`
const PRODUCT_SELECT = `
  SELECT p.*, COALESCE(i.quantity, 0) AS stock
  FROM products p
  LEFT JOIN inventory i ON i.productid = p.id
`;

/**
 * Build SQL query and parameters for products with optional filters
 */
const buildProductQuery = (filters: {
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  category?: string;
}) => {
  let queryStr = PRODUCT_SELECT;
  const params: any[] = [];
  const conditions: string[] = [];

  if (filters.featured !== undefined) {
    conditions.push('p.featured = $' + (params.length + 1));
    params.push(filters.featured);
  }
  if (filters.newArrival !== undefined) {
    conditions.push('p.newarrival = $' + (params.length + 1));
    params.push(filters.newArrival);
  }
  if (filters.bestseller !== undefined) {
    conditions.push('p.bestseller = $' + (params.length + 1));
    params.push(filters.bestseller);
  }
  if (filters.category !== undefined) {
    conditions.push('p.category = $' + (params.length + 1));
    params.push(filters.category);
  }

  if (conditions.length > 0) {
    queryStr += ' WHERE ' + conditions.join(' AND ');
  }

  queryStr += ' ORDER BY p.createdat DESC';

  return { queryStr, params };
};

export const getProducts = async (): Promise<ProductWithStock[]> => {
  const { queryStr, params } = buildProductQuery({});
  const result = await query(queryStr, params);
  return result.rows.map(mapToProduct);
};

export const getProductsWithFilters = async (filters: {
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  category?: string;
}): Promise<ProductWithStock[]> => {
  const { queryStr, params } = buildProductQuery(filters);
  const result = await query(queryStr, params);
  return result.rows.map(mapToProduct);
};

export const getProductBySlug = async (slug: string): Promise<ProductWithStock | null> => {
  const result = await query(`${PRODUCT_SELECT} WHERE p.slug = $1`, [slug]);
  if (result.rows.length === 0) return null;
  return mapToProduct(result.rows[0]);
};

/**
 * Set the absolute stock level for a product and record the movement.
 * Uses the provided client so it can take part in a transaction.
 */
const setStock = async (
  client: { query: (text: string, params?: any[]) => Promise<any> },
  productId: string,
  quantity: number,
  reason: string
) => {
  const current = await client.query('SELECT quantity FROM inventory WHERE productid = $1', [productId]);
  const previous = current.rows.length > 0 ? parseInt(current.rows[0].quantity, 10) : 0;
  await client.query(
    `INSERT INTO inventory (productid, quantity, reserved, updatedat)
     VALUES ($1, $2, 0, CURRENT_TIMESTAMP)
     ON CONFLICT (productid) DO UPDATE SET quantity = EXCLUDED.quantity, updatedat = CURRENT_TIMESTAMP`,
    [productId, quantity]
  );
  const change = quantity - previous;
  if (change !== 0) {
    await client.query(
      `INSERT INTO inventory_movements (productid, change, reason) VALUES ($1, $2, $3)`,
      [productId, change, reason]
    );
  }
};

export const createProduct = async (
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { stock?: number }
): Promise<ProductWithStock> => {
  const {
    slug, name, category, price, images, description, materials, dimensions, care,
    availability, featured, newArrival, bestseller, stock,
  } = product;

  const safeImages = Array.isArray(images) ? images : [];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO products (
        slug, name, category, price, images, description, materials, dimensions, care,
        availability, featured, newarrival, bestseller
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id`,
      [slug, name, category, price, safeImages, description, materials, dimensions, care,
        availability, featured, newArrival, bestseller]
    );
    const id = result.rows[0].id;
    // Every product gets an inventory row so it can be ordered
    await setStock(client, id, stock ?? 0, 'initial');
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return (await getProductBySlug(slug)) as ProductWithStock;
};

const COLUMN_MAP: Record<string, string> = {
  slug: 'slug',
  name: 'name',
  category: 'category',
  price: 'price',
  images: 'images',
  description: 'description',
  materials: 'materials',
  dimensions: 'dimensions',
  care: 'care',
  availability: 'availability',
  featured: 'featured',
  newArrival: 'newarrival',
  bestseller: 'bestseller',
};

/**
 * Update a product identified by its slug (the public API identifier).
 */
export const updateProduct = async (
  slug: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> & { stock?: number }
): Promise<ProductWithStock | null> => {
  const { stock, ...productUpdates } = updates;
  const fields = Object.keys(productUpdates).filter((f) => COLUMN_MAP[f] && (productUpdates as any)[f] !== undefined);
  if (fields.length === 0 && stock === undefined) {
    throw new Error('No fields to update');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM products WHERE slug = $1', [slug]);
    if (existing.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    const id = existing.rows[0].id;

    if (fields.length > 0) {
      const setClause = fields.map((field, index) => `${COLUMN_MAP[field]} = $${index + 2}`).join(', ');
      const values: any[] = [id];
      for (const field of fields) {
        let value = (productUpdates as any)[field];
        if (field === 'images') value = Array.isArray(value) ? value : [];
        values.push(value);
      }
      await client.query(
        `UPDATE products SET ${setClause}, updatedat = CURRENT_TIMESTAMP WHERE id = $1`,
        values
      );
    } else {
      await client.query('UPDATE products SET updatedat = CURRENT_TIMESTAMP WHERE id = $1', [id]);
    }

    if (stock !== undefined) {
      await setStock(client, id, stock, 'adjustment');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  const newSlug = (productUpdates.slug as string | undefined) ?? slug;
  return getProductBySlug(newSlug);
};

/**
 * Delete a product identified by its slug.
 */
export const deleteProduct = async (slug: string): Promise<boolean> => {
  const existing = await query('SELECT id FROM products WHERE slug = $1', [slug]);
  if (existing.rows.length === 0) return false;
  const id = existing.rows[0].id;

  // order_items.productid is NOT NULL, so a product with order history cannot be removed
  // without corrupting past orders. Refuse with a clear message instead of a 500.
  const referenced = await query('SELECT 1 FROM order_items WHERE productid = $1 LIMIT 1', [id]);
  if (referenced.rows.length > 0) {
    throw Object.assign(
      new Error('This product has order history and cannot be deleted. Set its availability to out of stock instead.'),
      { statusCode: 409 }
    );
  }

  const result = await query('DELETE FROM products WHERE id = $1', [id]);
  return result.rowCount !== null && result.rowCount > 0;
};
