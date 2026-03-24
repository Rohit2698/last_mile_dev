"use client"

import { VerificationStatusType } from "@/app/api/react-query/auth"
import { useBasicInfo } from "@/app/api/react-query/profile"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type User = {
  id: string
  email: string
  name: string
  token: string
  isVerified: boolean
}

interface DispensaryContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isAuthenticated: boolean
  verificationStatus: VerificationStatusType | null
}

const DispensaryContext = createContext<DispensaryContextType | undefined>(undefined)

export function DispensaryProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data } = useBasicInfo(!!user)
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
    verificationStatus: data?.verificationStatus as VerificationStatusType || null,
  }

  if (isLoading) {
    return null
  }

  return <DispensaryContext.Provider value={value}>{children}</DispensaryContext.Provider>
}

export function useDispensaryAuth() {
  const context = useContext(DispensaryContext)
  if (context === undefined) {
    throw new Error("useDispensaryAuth must be used within a DispensaryProvider")
  }
  return context
}
