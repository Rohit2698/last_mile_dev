"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispensaryAuth } from "@/context/DispensaryAuthContext"

export function useDashboardWizard() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useDispensaryAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dispensary/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/dispensary/login")
  }

  return {
    user,
    isAuthenticated,
    handleLogout,
  }
}
