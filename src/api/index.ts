import { getToken } from "@/helpers";
import axios, { AxiosResponse } from "axios";

// const BASE_URL = "https://api.staging.investinda.com";
// const BASE_URL = "http://192.168.0.102:9009";
const BASE_URL = "https://inda-core-backend-services.onrender.com";

const apiClient = axios.create({
  baseURL: BASE_URL,
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
    if (process.env.NODE_ENV === "development") {
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
    if (process.env.NODE_ENV === "development") {
      console.error("Request Interceptor Error:", error);
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`API Response: ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (process.env.NODE_ENV === "development") {
        console.error("API Error:", {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
