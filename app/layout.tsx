import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./suppress-overlays.css" // Suppress all error overlays
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-context"
import { Toaster } from "@/components/ui/sonner"
import ErrorBoundary from "@/components/error-boundary"
import DisableOverlay from "@/components/disable-overlay"
import "@/lib/dev-utils" // Initialize dev utils

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Harassment Reporting PWA",
  description: "A Progressive Web App for reporting and tracking harassment incidents",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/suppress-overlays.js" />
      </head>
      <body className={inter.className}>
        <DisableOverlay />
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
              {children}
              {process.env.NODE_ENV !== 'development' && <Toaster />}
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
