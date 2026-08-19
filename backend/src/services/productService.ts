import { query } from '../db/index';
import { Product } from '../models/Product';

// Helper to convert database row to Product object
const mapToProduct = (row: any): Product => ({
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
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

/**
 * Build SQL query and parameters for products with optional filters
 */
const buildProductQuery = (filters: {
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  category?: string;
}) => {
  let queryStr = 'SELECT * FROM products';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filters.featured !== undefined) {
    conditions.push('featured = $' + (params.length + 1));
    params.push(filters.featured);
  }
  if (filters.newArrival !== undefined) {
    conditions.push('newarrival = $' + (params.length + 1));
    params.push(filters.newArrival);
  }
  if (filters.bestseller !== undefined) {
    conditions.push('bestseller = $' + (params.length + 1));
    params.push(filters.bestseller);
  }
  if (filters.category !== undefined) {
    conditions.push('category = $' + (params.length + 1));
    params.push(filters.category);
  }

  if (conditions.length > 0) {
    queryStr += ' WHERE ' + conditions.join(' AND ');
  }

  queryStr += ' ORDER BY createdAt DESC';

  return { queryStr, params };
};

export const getProducts = async (): Promise<Product[]> => {
  const { queryStr, params } = buildProductQuery({});
  const result = await query(queryStr, params);
  return result.rows.map(mapToProduct);
};

export const getProductsWithFilters = async (filters: {
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  category?: string;
}): Promise<Product[]> => {
  const { queryStr, params } = buildProductQuery(filters);
  const result = await query(queryStr, params);
  return result.rows.map(mapToProduct);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const result = await query('SELECT * FROM products WHERE slug = $1', [slug]);
  if (result.rows.length === 0) return null;
  return mapToProduct(result.rows[0]);
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const {
    slug,
    name,
    category,
    price,
    images,
    description,
    materials,
    dimensions,
    care,
    availability,
    featured,
    newArrival,
    bestseller,
  } = product;

  // Ensure images is always an array, even if undefined
  const safeImages = Array.isArray(images) ? images : [];

  const result = await query(
    `INSERT INTO products (
      slug, name, category, price, images, description, materials, dimensions, care,
      availability, featured, newarrival, bestseller
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
    [
      slug,
      name,
      category,
      price,
      safeImages,
      description,
      materials,
      dimensions,
      care,
      availability,
      featured,
      newArrival,
      bestseller,
    ]
  );

  return mapToProduct(result.rows[0]);
};

export const updateProduct = async (
  id: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Product | null> => {
  // Build dynamic update query
  const fields = Object.keys(updates);
  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  const setClause = fields
    .map((field, index) => {
      // Map camelCase field names to snake_case column names where needed
      const columnName = field === 'newArrival' ? 'newarrival' : field;
      return `${columnName} = $${index + 2}`;
    })
    .join(', ');

  // Handle images array conversion
  const values: any[] = [id];
  for (const field of fields) {
    let value = (updates as any)[field];
    if (field === 'images' && value !== undefined) {
      value = Array.isArray(value) ? value : [];
    }
    values.push(value);
  }

  const result = await query(
    `
    UPDATE products
    SET ${setClause}, updatedAt = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `,
    values
  );

  if (result.rows.length === 0) return null;
  return mapToProduct(result.rows[0]);
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM products WHERE id = $1', [id]);
  return result.rowCount !== null && result.rowCount > 0;
};