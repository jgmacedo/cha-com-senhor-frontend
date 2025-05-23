import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Ensure environment variable is used if available
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Type for API error response
interface ApiError {
  message: string;
  status: number;
}

// Request interceptor with better typing and error handling
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug log in development
      if (process.env.NODE_ENV === "development") {
        console.debug("Request Config:", {
          url: config.url,
          method: config.method,
          hasToken: !!token,
        });
      }
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Debug log in development
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
        },
      });
    }

    switch (error.response?.status) {
      case 401:
        // Unauthorized - clear auth state and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
        break;

      case 403:
        // Forbidden - usually means valid token but insufficient permissions
        console.error("Permission denied. User lacks required privileges.");
        break;

      case 500:
        console.error("Server error:", error.response?.data);
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
