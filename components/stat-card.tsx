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
    <Card className="border-primary/20 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-primary">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {trend && (
              <p className={`text-xs font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-secondary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
