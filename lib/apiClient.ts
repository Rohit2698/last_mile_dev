import axios from "axios"
import { API_URL } from "./constant"
import { toast } from "react-toastify"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Flag to avoid duplicate 401 handling
let isAuthErrorHandled = false

// Only add interceptors in browser environment
if (typeof window !== "undefined") {
  apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  apiClient.interceptors.response.use(
    response => {
      isAuthErrorHandled = false
      return response
    },
    async error => {
      if (error.response?.status === 401 && !isAuthErrorHandled) {
        isAuthErrorHandled = true
        toast.error("Session expired. Please log in again.")
        try {
          localStorage.removeItem("authToken")
          localStorage.removeItem("authUser")
        } catch {}
        window.location.href = "/login"
      }
      return Promise.reject(error)
    },
  )
}

export default apiClient
