import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '../utils/env';

const apiClient: AxiosInstance = axios.create({
  baseURL: env.PREDATOR_URL,
  responseType: 'json',
});

// Placeholder for auth token retrieval - will be connected to Redux store later
function getAuthToken(): string | null {
  return null;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default apiClient;
