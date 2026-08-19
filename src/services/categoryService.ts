import apiClient from '@/lib/api/client';
import { Category } from '@/types/firebase';

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
