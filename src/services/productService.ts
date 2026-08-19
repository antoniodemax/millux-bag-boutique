import apiClient from '@/lib/api/client';
import { Product } from '@/types/models';

/**
 * Get all products from backend API
 * @returns Promise resolving to array of products
 */
export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/api/products');
  return response.data;
};

/**
 * Get a product by its slug
 * @param slug - Product slug
 * @returns Promise resolving to product or null if not found
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get(`/api/products/${slug}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Get featured products
 * @returns Promise resolving to array of featured products
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/api/products?featured=true');
  return response.data;
};

/**
 * Get new arrival products
 * @returns Promise resolving to array of new arrival products
 */
export const getNewArrivals = async (): Promise<Product[]> => {
  const response = await apiClient.get('/api/products?newArrival=true');
  return response.data;
};

/**
 * Get bestseller products
 * @returns Promise resolving to array of bestseller products
 */
export const getBestSellers = async (): Promise<Product[]> => {
  const response = await apiClient.get('/api/products?bestseller=true');
  return response.data;
};

/**
 * Get products by category
 * @param category - Category name
 * @returns Promise resolving to array of products in that category
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await apiClient.get(`/api/products?category=${category}`);
  return response.data;
};
