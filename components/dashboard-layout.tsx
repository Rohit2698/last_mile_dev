"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useDispensaryAuth } from "@/context/DispensaryAuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAdminAuth } from "@/context/AdminAuthContext"
import { useDeliveryAuth } from "@/context/DeliveryAuthContext"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "dispensary" | "delivery" | "admin"
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter()

  const dispensaryAuth = useDispensaryAuth()
  const adminAuth = useAdminAuth()
  const deliveryAuth = useDeliveryAuth()

  const { isAuthenticated, logout, user } =
    role === "admin" ? adminAuth :
    role === "delivery" ? deliveryAuth :
    dispensaryAuth

  const verificationStatus =
    role === "dispensary"
      ? dispensaryAuth.verificationStatus
      : role === "delivery"
        ? deliveryAuth.verificationStatus
        : null
  
  useEffect(() => {
    if (!isAuthenticated) {
      const loginPath = role === "admin" ? "/admin/login" : `/${role}/login`
      router.push(loginPath)
    }
  }, [isAuthenticated, role, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          verificationStatus={verificationStatus}
          user={user}
          key={verificationStatus}
          logout={logout}
          type={role}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
