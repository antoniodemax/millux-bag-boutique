import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add a request interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors or unexpected status codes
    if (!error.response) {
      throw new Error('Network error - please check your connection');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
