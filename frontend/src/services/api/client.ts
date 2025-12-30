import axios from 'axios';
import { API_CONFIG } from '@/lib/constants';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to unwrap backend response structure
apiClient.interceptors.response.use(
  (response) => {
    // If the response follows the { success: true, data: ... } pattern
    if (
      response.data &&
      response.data.success === true &&
      Object.prototype.hasOwnProperty.call(response.data, 'data')
    ) {
      // If it's a paginated response (has total/totalPages), return the whole object minus success
      if (
        response.data.total !== undefined ||
        response.data.totalPages !== undefined
      ) {
        const { success, ...paginatedData } = response.data;
        return {
          ...response,
          data: paginatedData,
        };
      }

      // Otherwise unwrap the data property for single-item or standard responses
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
