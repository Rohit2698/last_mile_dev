import axios from "axios"
import { API_URL } from "./constant"
import { toast } from "react-toastify"

const deliveryApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

let isAuthErrorHandled = false

if (typeof window !== "undefined") {
  deliveryApiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("delivery_authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  deliveryApiClient.interceptors.response.use(
    response => {
      isAuthErrorHandled = false
      return response
    },
    async error => {
      if (error.response?.status === 401 && !isAuthErrorHandled) {
        isAuthErrorHandled = true
        toast.error("Session expired. Please log in again.")
        try {
          localStorage.removeItem("delivery_authToken")
          localStorage.removeItem("delivery_authUser")
        } catch {}
        window.location.href = "/delivery/login"
      }
      return Promise.reject(error)
    },
  )
}

export default deliveryApiClient
