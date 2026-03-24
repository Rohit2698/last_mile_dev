import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { DispensaryProvider } from "@/context/DispensaryAuthContext"
import { AdminAuthProvider } from "@/context/AdminAuthContext"
import { ReactQueryProvider } from "@/context/ReactQueryProvider"
import { ToastProvider } from "@/context/ToastProvider"
import { DeliveryAuthProvider } from "@/context/DeliveryAuthContext"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "LastMile - Cannabis Delivery Platform",
  description:
    "Connect dispensaries, delivery partners, and drivers in one seamless platform for cannabis delivery.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ReactQueryProvider>
          <DispensaryProvider>
            <AdminAuthProvider>
              <DeliveryAuthProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                  <ToastProvider />
                </ThemeProvider>
              </DeliveryAuthProvider>
            </AdminAuthProvider>
          </DispensaryProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
