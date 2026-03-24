"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import apiClient from "@/lib/apiClient"
import { toast } from "react-toastify"
import { useAdminAuth } from "@/context/AdminAuthContext"

export default function AdminLoginPage() {
  const router = useRouter()
  const { setUser } = useAdminAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiClient.post("/admin/login", {
        email,
        password,
      })

      if (response.data.success) {
        const { token, admin } = response.data.data

        // Set user in context (will automatically save to localStorage)
        setUser({ ...admin, token })

        toast.success("Login successful!")
        router.push("/admin/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message // eslint-disable-line @typescript-eslint/no-explicit-any
        : "Login failed. Please check your credentials."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Admin Portal</CardTitle>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@cannabis2u.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Default Admin Credentials:</p>
            <p className="mt-1 font-mono text-xs">admin@cannabis2u.com / Admin123!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
