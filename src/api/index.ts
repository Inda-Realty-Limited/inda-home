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

export const getStoredToken = (): string | null => {
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

    // Let axios set the correct Content-Type for FormData (multipart/form-data with boundary)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
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

      // Handle 401 Unauthorized — but not for auth endpoints (login/register errors must reach the caller)
      if (error.response.status === 401) {
        const requestUrl = error.config?.url || "";
        const isAuthEndpoint = requestUrl.includes("/auth/");

        if (!isAuthEndpoint && typeof window !== "undefined") {
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
