"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout role="admin">
      <div className="p-4">{children}</div>
    </DashboardLayout>
  )
}
