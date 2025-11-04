import { getToken, removeToken, removeUser } from "@/helpers";
import { env } from "@/config/env";
import axios, { AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: env.api.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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
  (error) => {
    if (error.response) {
      if (env.isDevelopment) {
        console.error("API Error:", {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
      }
      const status = error.response.status;
      if (status === 401 || status === 419) {
        try {
          removeToken();
          removeUser();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("inda:token-removed"));
            // Prefer sign-in page; fallback to home
            const redirectTo =
              (error.response.data && error.response.data.redirectTo) ||
              "/auth/signin";
            if (window.location.pathname !== redirectTo) {
              window.location.href = redirectTo;
            }
          }
        } catch {}
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
