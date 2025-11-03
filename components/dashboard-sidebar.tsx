"use client"

import { Scale, Calendar, Users, Bell, Settings, LayoutDashboard, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/dashboard" },
  { icon: Calendar, label: "الأجندة", href: "/dashboard/agenda" },
  { icon: Users, label: "العملاء", href: "/dashboard/clients" },
  { icon: Bell, label: "التنبيهات", href: "/dashboard/notifications" },
  { icon: Settings, label: "الإعدادات", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden bg-card/80 backdrop-blur-sm shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 right-0 z-40 w-64 border-l border-border bg-card/95 backdrop-blur-sm flex flex-col transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-primary">أجندة المحامي</h2>
              <p className="text-xs text-muted-foreground">نظام إدارة المواعيد</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                  "hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-md",
                  isActive && "bg-secondary text-secondary-foreground shadow-lg scale-105",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 shadow-sm">
            <p className="text-xs text-primary font-semibold mb-1">نصيحة اليوم</p>
            <p className="text-xs text-muted-foreground leading-relaxed">تأكد من مراجعة مواعيدك القادمة يومياً</p>
          </div>
        </div>
      </aside>
    </>
  )
}
