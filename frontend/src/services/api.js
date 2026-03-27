import axios from 'axios'
import { clearStoredAuth, loadStoredAuth } from '../utils/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const storedAuth = loadStoredAuth()

  if (storedAuth?.token) {
    config.headers.Authorization = `Bearer ${storedAuth.token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth()
    }

    return Promise.reject(error)
  }
)

export default api
