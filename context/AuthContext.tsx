"use client"

import { VerificationStatusType } from "@/app/api/react-query/auth"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type User = {
  id: string
  email: string
  name: string
  token: string
  isVerified: boolean
  verificationStatus: VerificationStatusType
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const storedUser = localStorage.getItem("authUser")
      const storedToken = localStorage.getItem("authToken")
      
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Save user to localStorage whenever it changes
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user))
      localStorage.setItem("authToken", user.token)
    } else {
      localStorage.removeItem("authUser")
      localStorage.removeItem("authToken")
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
