"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Users, Truck, FileCheck } from "lucide-react"
import apiClient from "@/lib/apiClient"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/context/AdminAuthContext"

interface Stats {
  dispensaries: number
  drivers: number
  deliveryPartners: number
  pendingDocuments: number
}

export default function AdminDashboard() {
  const { user: adminUser } = useAdminAuth()
  const [stats, setStats] = useState<Stats>({
    dispensaries: 0,
    drivers: 0,
    deliveryPartners: 0,
    pendingDocuments: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      
      const [dispensariesRes, driversRes, partnersRes, docsRes] = await Promise.all([
        apiClient.get("/admin/dispensaries?page=1&limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiClient.get("/admin/drivers?page=1&limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiClient.get("/admin/delivery-partners?page=1&limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiClient.get("/admin/verification-documents?page=1&limit=1&status=PENDING", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setStats({
        dispensaries: dispensariesRes.data.meta?.total || 0,
        drivers: driversRes.data.meta?.total || 0,
        deliveryPartners: partnersRes.data.meta?.total || 0,
        pendingDocuments: docsRes.data.meta?.total || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Dispensaries",
      value: stats.dispensaries,
      icon: Store,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      link: "/admin/dashboard/dispensary-approval",
    },
    {
      title: "Total Drivers",
      value: stats.drivers,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      link: "/admin/dashboard/driver-approval",
    },
    {
      title: "Delivery Partners",
      value: stats.deliveryPartners,
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      link: "/admin/dashboard/partner-approval",
    },
    {
      title: "Pending Documents",
      value: stats.pendingDocuments,
      icon: FileCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      link: "/admin/dashboard/dispensary-approval",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {adminUser?.name || "Admin"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.title} href={card.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {card.title}
                    </CardTitle>
                    <div className={`${card.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/dashboard/dispensary-approval">
              <Button variant="outline" className="w-full justify-start">
                <Store className="mr-2 h-4 w-4" />
                Review Dispensary Applications
              </Button>
            </Link>
            <Link href="/admin/dashboard/driver-approval">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Review Driver Applications
              </Button>
            </Link>
            <Link href="/admin/dashboard/partner-approval">
              <Button variant="outline" className="w-full justify-start">
                <Truck className="mr-2 h-4 w-4" />
                Review Partner Applications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
