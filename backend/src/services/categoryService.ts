import { query } from '../db/index';
import { Category } from '../models/Category';

const mapToCategory = (row: any): Category & { productCount: number } => ({
  id: row.id,
  name: row.name,
  image: row.image ?? '',
  available: row.available,
  orderNumber: row.ordernumber,
  productCount: row.product_count !== undefined ? parseInt(row.product_count, 10) : 0,
  createdAt: row.createdat,
  updatedAt: row.updatedat,
});

// Products reference categories by name, so expose how many products use each category
const CATEGORY_SELECT = `
  SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category = c.name) AS product_count
  FROM categories c
`;

/**
 * Build SQL query and parameters for categories with optional filters
 */
const buildCategoryQuery = (filters: {
  available?: boolean;
}) => {
  let queryStr = CATEGORY_SELECT;
  const params: any[] = [];
  const conditions: string[] = [];

  if (filters.available !== undefined) {
    conditions.push('c.available = $' + (params.length + 1));
    params.push(filters.available);
  }

  if (conditions.length > 0) {
    queryStr += ' WHERE ' + conditions.join(' AND ');
  }

  queryStr += ' ORDER BY c.ordernumber ASC, c.name ASC';

  return { queryStr, params };
};

export const getCategories = async (): Promise<Category[]> => {
  const { queryStr, params } = buildCategoryQuery({});
  const result = await query(queryStr, params);
  return result.rows.map(mapToCategory);
};

export const getCategoriesWithFilters = async (filters: {
  available?: boolean;
}): Promise<Category[]> => {
  const { queryStr, params } = buildCategoryQuery(filters);
  const result = await query(queryStr, params);
  return result.rows.map(mapToCategory);
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const result = await query(`${CATEGORY_SELECT} WHERE c.id = $1`, [id]);
  if (result.rows.length === 0) return null;
  return mapToCategory(result.rows[0]);
};

export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Category> => {
  const {
    name,
    image,
    available,
    orderNumber,
  } = category;

  const result = await query(
    `INSERT INTO categories (name, image, available, orderNumber)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [name, image, available, orderNumber]
  );

  return (await getCategoryById(result.rows[0].id)) as Category;
};

export const updateCategory = async (
  id: string,
  updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Category | null> => {
  const COLUMN_MAP: Record<string, string> = { name: 'name', image: 'image', available: 'available', orderNumber: 'ordernumber' };
  const fields = Object.keys(updates).filter((f) => COLUMN_MAP[f] && (updates as any)[f] !== undefined);
  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  const setClause = fields.map((f, idx) => `${COLUMN_MAP[f]} = $${idx + 2}`).join(', ');
  const values = [id, ...fields.map((f) => (updates as any)[f])];

  const result = await query(
    `
    UPDATE categories
    SET ${setClause}, updatedat = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id
    `,
    values
  );

  if (result.rows.length === 0) return null;
  return getCategoryById(id);
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM categories WHERE id = $1', [id]);
  return result.rowCount !== null && result.rowCount > 0;
};