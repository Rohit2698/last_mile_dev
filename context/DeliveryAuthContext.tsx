"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { usePartnerProfile } from "@/app/api/react-query/deliveryProfile"

export interface DeliveryUser {
  id: string
  email: string
  companyName: string
  token: string
  name: string
}

interface DeliveryAuthContextType {
  user: DeliveryUser | null
  deliveryUser: DeliveryUser | null
  setDeliveryUser: (user: Omit<DeliveryUser, "name"> | DeliveryUser | null) => void
  logout: () => void
  deliveryLogout: () => void
  isAuthenticated: boolean
  isDeliveryAuthenticated: boolean
  verificationStatus: string | null
}

const DeliveryAuthContext = createContext<DeliveryAuthContextType | undefined>(undefined)

export function DeliveryAuthProvider({ children }: { children: ReactNode }) {
  const [deliveryUser, setDeliveryUser] = useState<DeliveryUser | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const { data: profileData } = usePartnerProfile(!!deliveryUser)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("delivery_authUser")
      const storedToken = localStorage.getItem("delivery_authToken")

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser)
        setDeliveryUser({ ...parsedUser, name: parsedUser.name ?? parsedUser.companyName })
      }
    } catch (error) {
      console.error("Error loading delivery user from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (deliveryUser) {
      localStorage.setItem("delivery_authUser", JSON.stringify(deliveryUser))
      localStorage.setItem("delivery_authToken", deliveryUser.token)
    } else {
      localStorage.removeItem("delivery_authUser")
      localStorage.removeItem("delivery_authToken")
    }
  }, [deliveryUser])

  const deliveryLogout = () => {
    setDeliveryUser(null)
  }

  const normalizedSetDeliveryUser = (u: Omit<DeliveryUser, "name"> | DeliveryUser | null) => {
    if (!u) {
      setDeliveryUser(null)
      return
    }
    setDeliveryUser({ ...u, name: (u as DeliveryUser).name ?? u.companyName })
  }

  const value = {
    user: deliveryUser,
    deliveryUser,
    setDeliveryUser: normalizedSetDeliveryUser,
    logout: deliveryLogout,
    deliveryLogout,
    isAuthenticated: !!deliveryUser,
    isDeliveryAuthenticated: !!deliveryUser,
    verificationStatus: profileData?.verificationStatus ?? null,
  }

  if (isLoading) {
    return null
  }

  return (
    <DeliveryAuthContext.Provider value={value}>
      {children}
    </DeliveryAuthContext.Provider>
  )
}

export function useDeliveryAuth() {
  const context = useContext(DeliveryAuthContext)
  if (context === undefined) {
    throw new Error("useDeliveryAuth must be used within a DeliveryAuthProvider")
  }
  return context
}

