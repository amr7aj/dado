import type { Notification } from "@/lib/notifications"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Clock, Calendar, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NotificationCardProps {
  notification: Notification
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "today":
        return <Bell className="w-5 h-5" />
      case "tomorrow":
        return <Clock className="w-5 h-5" />
      case "upcoming":
        return <Calendar className="w-5 h-5" />
      case "overdue":
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getColor = () => {
    switch (notification.priority) {
      case "high":
        return "bg-red-500/10 border-red-500/30 text-red-600"
      case "medium":
        return "bg-secondary/10 border-secondary/30 text-secondary"
      case "low":
        return "bg-blue-500/10 border-blue-500/30 text-blue-600"
      default:
        return "bg-muted border-border text-muted-foreground"
    }
  }

  const getTypeLabel = () => {
    switch (notification.type) {
      case "today":
        return "اليوم"
      case "tomorrow":
        return "غداً"
      case "upcoming":
        return "قادم"
      case "overdue":
        return "فائت"
      default:
        return ""
    }
  }

  return (
    <Card
      className={cn(
        "border-2 transition-all duration-300 hover:shadow-lg",
        notification.priority === "high" && "border-red-500/30 bg-red-500/5",
        notification.priority === "medium" && "border-secondary/30 bg-secondary/5",
        notification.priority === "low" && "border-blue-500/30 bg-blue-500/5",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", getColor())}>
            {getIcon()}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg text-primary">{notification.title}</h3>
              <Badge variant="outline" className={getColor()}>
                {getTypeLabel()}
              </Badge>
            </div>

            <p className="text-muted-foreground">{notification.message}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(notification.date).toLocaleDateString("ar-EG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{notification.time}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
