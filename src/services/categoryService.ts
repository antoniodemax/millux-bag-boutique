import apiClient from '@/lib/api/client';
import { Category } from '@/types/models';

export type { Category };

/** Fields accepted by the create/update category endpoints */
export interface CategoryPayload {
  name: string;
  image?: string;
  available?: boolean;
  orderNumber?: number;
}

/**
 * Get all categories from backend API
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/api/categories');
  return response.data;
};

/**
 * Get only available categories
 */
export const getAvailableCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/api/categories?available=true');
  return response.data;
};

/**
 * Create a new category (admin)
 */
export const createCategory = async (categoryData: CategoryPayload): Promise<Category> => {
  const response = await apiClient.post('/api/categories', categoryData);
  return response.data;
};

/**
 * Update an existing category (admin)
 */
export const updateCategory = async (id: string, categoryData: Partial<CategoryPayload>): Promise<Category> => {
  const response = await apiClient.put(`/api/categories/${id}`, categoryData);
  return response.data;
};

/**
 * Delete a category (admin)
 */
export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/categories/${id}`);
};
