import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
  return (
    <Card className="border-primary/20 bg-card/90 backdrop-blur-sm hover-lift hover:border-primary/40 transition-all duration-300 group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {title}
            </p>
            <p className="text-3xl font-bold text-primary group-hover:scale-105 transition-transform duration-300 inline-block">
              {value}
            </p>
            {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}
            {trend && (
              <p className={`text-xs font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
            <Icon className="w-6 h-6 text-secondary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
