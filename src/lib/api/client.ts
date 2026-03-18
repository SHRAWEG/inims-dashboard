import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Helper to get cookie value by name on client side
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
};

apiClient.interceptors.request.use((config) => {
  const token = getCookie('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Handle 401 Unauthorized for token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call the Next.js proxy route to refresh cookies
        const refreshResponse = await axios.post('/api/auth/refresh');
        if (refreshResponse.status === 200) {
          // Retry the original request (as the cookies are now updated, 
          // the getCookie logic will fetch the new access_token)
          // Wait, actually Axios will run the request interceptor again!
          const newToken = getCookie('access_token');
          if (newToken && originalRequest.headers) {
             originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, kick user to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
