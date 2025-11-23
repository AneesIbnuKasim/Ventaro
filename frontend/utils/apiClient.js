import axios from 'axios'
import { API_CONFIG, AUTH_CONFIG } from '../config/app.js'

// LocalStorage helpers
export const getAuthToken = () => localStorage.getItem(AUTH_CONFIG.tokenKey)
export const getAdminToken = () => localStorage.getItem(AUTH_CONFIG.adminTokenKey)
export const getUser = () => {
  const userData = localStorage.getItem(AUTH_CONFIG.userKey)
  return userData ? JSON.parse(userData) : null
}
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_CONFIG.tokenKey, token)
  } else {
    localStorage.removeItem(AUTH_CONFIG.tokenKey)
  }
}
export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_CONFIG.adminTokenKey, token)
  } else {
    localStorage.removeItem(AUTH_CONFIG.adminTokenKey)
  }
}
export const setUser = (userData) => {
  if (userData) {
    localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(userData))
  } else {
    localStorage.removeItem(AUTH_CONFIG.userKey)
  }
}
export const clearTokens = () => {
  localStorage.removeItem(AUTH_CONFIG.tokenKey)
  localStorage.removeItem(AUTH_CONFIG.adminTokenKey)
  localStorage.removeItem(AUTH_CONFIG.userKey)
}

// Axios client with interceptors
const createApiClient = () => {
  const client = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
  })
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken() || getAdminToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        clearTokens()
        toast.error('Session expired. Please login again.')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (error.response?.status === 403) {
      if (error.response?.data?.banned) {
        clearTokens()
        toast.error('Your account has been banned. Please contact support.')
        window.location.href = '/login'
        return Promise.reject(error)
      }
      toast.error('Access denied. Insufficient permissions.')
      return Promise.reject(error)
    }

    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.status >= 400) {
      toast.error(message)
    }
    
    return Promise.reject(error)
    }
  )
  return client
}
export const apiClient = createApiClient()

// API request wrapper
const makeRequest = async (config) => {
  try {
    const response = await apiClient(config)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Request failed'
    throw new Error(message)
  }
}
export default makeRequest

export const authAPI = {
  register: (data) => makeRequest({ method: 'POST', url: '/auth/register', data }),
  login: (data) => makeRequest({ method: 'POST', url: '/auth/login', data }),
};
