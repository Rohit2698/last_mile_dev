"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Package } from "lucide-react"

export function Header() {
  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">LastMile</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="/dispensary/login" className="text-sm font-medium transition-colors hover:text-primary">
            Dispensary
          </a>
          <a href="/delivery/login" className="text-sm font-medium transition-colors hover:text-primary">
            Delivery Partner
          </a>
          <a href="#driver" className="text-sm font-medium transition-colors hover:text-primary">
            Driver
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
