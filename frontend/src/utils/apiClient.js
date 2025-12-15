import axios from "axios";
import { API_CONFIG, AUTH_CONFIG } from "../config/app.js";
import { toast } from "react-toastify";
import qs from "qs";

// LocalStorage helpers
export const getAuthToken = () => localStorage.getItem(AUTH_CONFIG.tokenKey);
export const getAdminToken = () =>
  localStorage.getItem(AUTH_CONFIG.adminTokenKey);
export const getUser = () => {
  const userData = localStorage.getItem(AUTH_CONFIG.userKey);
  return userData ? JSON.parse(userData) : null;
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_CONFIG.tokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
  }
};

export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_CONFIG.adminTokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.adminTokenKey);
  }
};

export const setResetToken = (token) => {
  if (token) {
    console.log("reset:", token);

    localStorage.setItem(AUTH_CONFIG.resetTokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.resetTokenKey);
  }
};

export const setUser = (userData) => {
  if (userData) {
    localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(userData));
  } else {
    localStorage.removeItem(AUTH_CONFIG.userKey);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(AUTH_CONFIG.tokenKey);
  localStorage.removeItem(AUTH_CONFIG.adminTokenKey);
  localStorage.removeItem(AUTH_CONFIG.userKey);
};

// Axios client with interceptors
const createApiClient = () => {
  const client = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
    paramsSerializer: {
      serialize: (params) =>
        qs.stringify(params, {
          arrayFormat: "comma",
          skipNulls: true,
        }),
    },
  });

  client.interceptors.request.use(
    (config) => {
      console.log("req interceptor:");
      const token = getAuthToken() || getAdminToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('Error in interceptor:', error);
      
      if (error.response?.status === 401) {
        clearTokens();
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (error.response?.status === 403) {
        if (error.response?.data?.banned) {
          clearTokens();
          toast.error("Your account has been banned. Please contact support.");
          window.location.href = "/login";
          return Promise.reject(error);
        }
        toast.error("Access denied. Insufficient permissions.");
        return Promise.reject(error);
      }

      //backend actual response
      const backendError = error.response?.data?.error;

      //normalize BE response to preserve all error details
      const normalizedError = {
        message: backendError?.message || "Request failed",
        code: backendError?.code || error.code,
        statusCode: backendError?.statusCode || error.response?.status,
        raw: error,
      };

      if (normalizedError.statusCode >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(normalizedError.message || "Bad request");
      }
      return Promise.reject(normalizedError);
    }
  );
  return client;
};

export const apiClient = createApiClient();

// API request wrapper
export const makeRequest = async (config) => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default makeRequest;
