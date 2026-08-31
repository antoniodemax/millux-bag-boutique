import apiClient from '@/lib/api/client';
import { Category } from '@/types/models';

/**
 * Get all categories from backend API
 * @returns Promise resolving to array of categories
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/api/categories');
  return response.data;
};

/**
 * Get only available categories
 * @returns Promise resolving to array of available categories
 */
export const getAvailableCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/api/categories?available=true');
  return response.data;
};

/**
 * Create a new category
 * @param categoryData - Category data (without id)
 * @returns Promise resolving to created category
 */
export const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
  const response = await apiClient.post('/api/categories', categoryData);
  return response.data;
};

/**
 * Update an existing category
 * @param id - Category id
 * @param categoryData - Partial category data to update
 * @returns Promise resolving to updated category
 */
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> => {
  const response = await apiClient.put(`/api/categories/${id}`, categoryData);
  return response.data;
};

/**
 * Delete a category
 * @param id - Category id
 * @returns Promise resolving to void
 */
export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/categories/${id}`);
};