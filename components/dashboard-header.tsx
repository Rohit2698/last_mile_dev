"use client"

import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { User as UserType } from "@/context/AuthContext"
import { AdminUser } from "@/context/AdminAuthContext"
import { useRouter } from "next/navigation"
import { Badge } from "./ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

type DashboardHeaderProps = {
  user: UserType | AdminUser | null
  logout: () => void
  verificationStatus?: string | null
}
export function DashboardHeader({ user, logout, verificationStatus }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleProfile = () => {
    router.push("/dispensary/profile")
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - can be used for breadcrumbs or page title */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          {verificationStatus && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  className={`text-sm font-medium capitalize cursor-pointer`}
                  onClick={() => router.push("/dispensary/profile")}
                >
                  {verificationStatus.replace(/_/g, " ")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {verificationStatus === "WAITING_FOR_DOCUMENT"
                  ? "Click to upload your verification documents"
                  : `Verification status: ${verificationStatus.replace(/_/g, " ")}`}
              </TooltipContent>
            </Tooltip>
          )}
          {typeof (user as UserType)?.isVerified !== 'undefined' && (
            <Tooltip>
              <TooltipTrigger>
                {(user as UserType)?.isVerified ? (
                  <Badge className="text-sm bg-green-500 font-medium dark:bg-green-500 dark:text-white">
                    Verified
                  </Badge>
                ) : (
                  <Badge className="text-sm bg-red-500 font-medium dark:bg-red-500 dark:text-white">
                    Not Verified
                  </Badge>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {(user as UserType)?.isVerified
                  ? "Your account is verified"
                  : "Your account is not verified"}
              </TooltipContent>
            </Tooltip>
          )}

          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {/* Notification badge - can be conditionally shown */}
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
