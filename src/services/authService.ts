import apiClient from '@/lib/api/client';

// User interface (without password)
export interface User {
  id: string;
  email: string;
  role: string;
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
 * Logout user by calling backend endpoint
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout');
};

/**
 * Get current authenticated user
 * @returns Promise resolving to user data or throws if not authenticated
 */
export const me = async (): Promise<User> => {
  const response = await apiClient.get('/api/auth/me');
  return response.data.user;
};
