import { query } from '../db/index';
import { Category } from '../models/Category';

const mapToCategory = (row: any): Category => ({
  id: row.id,
  name: row.name,
  image: row.image ?? '',
  available: row.available,
  orderNumber: row.orderNumber,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

/**
 * Build SQL query and parameters for categories with optional filters
 */
const buildCategoryQuery = (filters: {
  available?: boolean;
}) => {
  let queryStr = 'SELECT * FROM categories';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filters.available !== undefined) {
    conditions.push('available = $' + (params.length + 1));
    params.push(filters.available);
  }

  if (conditions.length > 0) {
    queryStr += ' WHERE ' + conditions.join(' AND ');
  }

  queryStr += ' ORDER BY orderNumber ASC';

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
  const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
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
     RETURNING *`,
    [name, image, available, orderNumber]
  );

  return mapToCategory(result.rows[0]);
};

export const updateCategory = async (
  id: string,
  updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Category | null> => {
  const fields = Object.keys(updates);
  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  const setClause = fields.map((f, idx) => `${f} = $${idx + 2}`).join(', ');
  const values = [id, ...Object.values(updates)];

  const result = await query(
    `
    UPDATE categories
    SET ${setClause}, updatedAt = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `,
    values
  );

  if (result.rows.length === 0) return null;
  return mapToCategory(result.rows[0]);
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM categories WHERE id = $1', [id]);
  return result.rowCount !== null && result.rowCount > 0;
};