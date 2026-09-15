import apiClient from '@/lib/api/client';
import { Product } from '@/types/models';

export type { Product };

/** Fields accepted by the create/update product endpoints */
export interface ProductPayload {
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  description?: string;
  materials?: string;
  dimensions?: string;
  care?: string;
  availability?: Product['availability'];
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
}

/**
 * Get all products from backend API
 */
export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/api/products');
  return response.data;
};

/**
 * Get a product by its slug, or null if not found
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get(`/api/products/${encodeURIComponent(slug)}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/api/products?featured=true');
  return response.data;
};

export const getNewArrivals = async (): Promise<Product[]> => {
  const response = await apiClient.get('/api/products?newArrival=true');
  return response.data;
};

export const getBestSellers = async (): Promise<Product[]> => {
  const response = await apiClient.get('/api/products?bestseller=true');
  return response.data;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await apiClient.get(`/api/products?category=${encodeURIComponent(category)}`);
  return response.data;
};

/**
 * Create a new product (admin)
 */
export const createProduct = async (productData: ProductPayload): Promise<Product> => {
  const response = await apiClient.post('/api/products', productData);
  return response.data;
};

/**
 * Update an existing product by slug (admin)
 */
export const updateProduct = async (slug: string, productData: Partial<ProductPayload>): Promise<Product> => {
  const response = await apiClient.put(`/api/products/${encodeURIComponent(slug)}`, productData);
  return response.data;
};

/**
 * Delete a product by slug (admin). Rejects with 409 if the product has order history.
 */
export const deleteProduct = async (slug: string): Promise<void> => {
  await apiClient.delete(`/api/products/${encodeURIComponent(slug)}`);
};

/**
 * Upload an image file (admin)
 */
export const uploadImage = async (file: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/api/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
