import apiClient from '@/lib/api/client';
import { Customer } from '@/types/models';

// User interface (without password)
export interface User {
  id: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Login user
 * @param email - User's email
 * @param password - User's password
 * @returns Promise resolving to user data
 */
export const login = async (email: string, password: string): Promise<User> => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  // The backend sets the HTTP-only cookie; we return user data for client use
  return response.data.user;
};

/**
 * Login user with Google OAuth
 * Redirects to Google OAuth endpoint
 */
export const googleLogin = (): void => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  window.location.href = `${API_BASE_URL}/api/auth/google`;
};

/**
 * Logout user by calling backend endpoint
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout');
};

/**
 * Register a new staff user (admin only)
 */
export const registerUser = async (
  email: string,
  password: string,
  role: 'admin' | 'user' = 'admin'
): Promise<User> => {
  const response = await apiClient.post('/api/auth/register', { email, password, role });
  return response.data.user;
};

/**
 * Get current authenticated user
 * @returns Promise resolving to user data or throws if not authenticated
 */
export const me = async (): Promise<User> => {
  const response = await apiClient.get('/api/auth/me');
  return response.data.user;
};

/**
 * Register a new customer
 * @param customerData - Customer registration data (email, password, name, phone)
 * @returns Promise resolving to customer data
 */
export const customerRegister = async (
  customerData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }
): Promise<{ id: string; email: string; name: string }> => {
  const response = await apiClient.post('/api/customers/register', customerData);
  return response.data.customer;
};

/**
 * Login customer
 * @param credentials - Customer login credentials (email, password)
 * @returns Promise resolving to customer data or throws if not authenticated
 */
export const customerLogin = async (
  credentials: {
    email: string;
    password: string;
  }
): Promise<{ id: string; email: string; name: string }> => {
  const response = await apiClient.post('/api/customers/login', credentials);
  return response.data.customer;
};

/**
 * Logout customer by calling backend endpoint
 * @returns Promise resolving to void
 */
export const customerLogout = async (): Promise<void> => {
  await apiClient.post('/api/customers/logout');
};

/**
 * Get current authenticated customer
 * @returns Promise resolving to customer data or throws if not authenticated
 */
export const getCustomerProfile = async (): Promise<Customer> => {
  const response = await apiClient.get('/api/customers/profile');
  return response.data.customer;
};

/**
 * Get customer order history
 * @returns Promise resolving to array of orders with items
 */
export const getCustomerOrders = async (): Promise<Array<any>> => {
  const response = await apiClient.get('/api/customers/orders');
  return response.data;
};
