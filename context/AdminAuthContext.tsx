"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type AdminUser = {
  id: string
  email: string
  name: string
  role: string
  token: string
}

interface AdminAuthContextType {
  user: AdminUser | null
  setUser: (user: AdminUser | null) => void
  logout: () => void
  isAuthenticated: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("adminUser")
        const storedToken = localStorage.getItem("adminToken")
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser)
          setUser({ ...parsedUser, token: storedToken })
        }
      } catch (error) {
        console.error("Error loading admin user from localStorage:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUser()
  }, [])

  useEffect(() => {
    // Save user to localStorage whenever it changes
    if (user) {
      localStorage.setItem("adminUser", JSON.stringify(user))
      localStorage.setItem("adminToken", user.token)
    } else {
      localStorage.removeItem("adminUser")
      localStorage.removeItem("adminToken")
    }
  }, [user])

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    setUser,
    logout,
    isAuthenticated: !!user,
  }

  if (isLoading) {
    return null
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
