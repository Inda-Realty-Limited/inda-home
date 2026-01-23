import { env } from "@/config/env";
import axios, { AxiosResponse } from "axios";
import CryptoJS from "crypto-js";

// Debug: Log what baseURL is being used
console.log('[API Client] Creating axios instance with baseURL:', env.api.baseUrl);
console.log('[API Client] Raw env var:', process.env.NEXT_PUBLIC_API_BASE_URL);

const apiClient = axios.create({
  baseURL: env.api.baseUrl,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

const getTokenSecret = () => {
  return env.security.encryptionSecret;
};

const getStoredToken = (): string | null => {
  try {
    const encrypted = localStorage.getItem("inda_token");
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, getTokenSecret());
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch {
    return null;
  }
};

// Refresh logic variables removed

apiClient.interceptors.request.use(
  (config) => {
    // Add Authorization header with token from localStorage
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (env.isDevelopment) {
      console.log(
        `API Request: ${config.method?.toUpperCase() || "UNKNOWN"} ${config.url
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

// Response interceptor
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
    if (error.response) {
      if (env.isDevelopment) {
        console.error("API Error:", {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
      }

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          // Dispatch event for other listeners
          window.dispatchEvent(new Event("inda:session-expired"));

          const currentPath = window.location.pathname;

          // Redirect to login if not already there
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
