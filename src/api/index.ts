import { env } from "@/config/env";
import axios, { AxiosResponse } from "axios";
import CryptoJS from "crypto-js";

// Debug: Log what baseURL is being used
console.log('[API Client] Creating axios instance with baseURL:', env.api.baseUrl);
console.log('[API Client] Raw env var:', process.env.NEXT_PUBLIC_API_BASE_URL);

const apiClient = axios.create({
  baseURL: env.api.baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get decrypted token from localStorage
const getStoredToken = (): string | null => {
  try {
    const encrypted = localStorage.getItem("inda_token");
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, env.security.encryptionSecret);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (e) {
    return null;
  }
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    // Add Authorization header with token from localStorage
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (env.isDevelopment) {
      console.log(
        `API Request: ${config.method?.toUpperCase() || "UNKNOWN"} ${
          config.url
        }`,
        {
          headers: config.headers,
          data: config.data,
        }
      );
    }
    return config;
  },
  (error) => {
    if (env.isDevelopment) {
      console.error("Request Interceptor Error:", error);
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (env.isDevelopment) {
      console.log(`API Response: ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      if (env.isDevelopment) {
        console.error("API Error:", {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
      }
      
      const status = error.response.status;
      
      if (status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => apiClient(originalRequest))
            .catch(err => Promise.reject(err));
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          await axios.post(
            `${env.api.baseUrl}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          
          isRefreshing = false;
          processQueue();
          return apiClient(originalRequest);
        } catch (refreshError: any) {
          isRefreshing = false;
          processQueue(refreshError);
          
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("inda:session-expired"));
            const currentPath = window.location.pathname;
            
            if (!currentPath.startsWith("/auth")) {
              const returnTo = encodeURIComponent(currentPath + window.location.search);
              window.location.href = `/auth/signin?returnTo=${returnTo}`;
            }
          }
          
          return Promise.reject(refreshError);
        }
      }
      
      if (status === 401 && originalRequest.url === '/auth/refresh') {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("inda:session-expired"));
          const currentPath = window.location.pathname;
          
          if (!currentPath.startsWith("/auth")) {
            const returnTo = encodeURIComponent(currentPath + window.location.search);
            window.location.href = `/auth/signin?returnTo=${returnTo}`;
            }
          }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
