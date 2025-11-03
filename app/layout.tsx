import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { AppointmentsProvider } from "@/lib/appointments-context"
import { ThemeProvider } from "@/lib/theme-context"
import "./globals.css"

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "600", "700"] })

export const metadata: Metadata = {
  title: "أجندة المحامي - Lawyer Agenda",
  description: "نظام إدارة المواعيد والجلسات القانونية",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <AppointmentsProvider>{children}</AppointmentsProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
