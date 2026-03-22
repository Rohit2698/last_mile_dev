"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/context/AuthContext"
import { useAdminAuth } from "@/context/AdminAuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "dispensary" | "delivery" | "admin"
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter()
  
  // Always call both hooks to avoid conditional hook calls
  const regularAuth = useAuth()
  const adminAuth = useAdminAuth()
  
  // Use appropriate auth context based on role
  const { isAuthenticated, logout, user } = role === "admin" ? adminAuth : regularAuth

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
        <DashboardHeader user={user} logout={logout} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
