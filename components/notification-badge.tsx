"use client"

import { useAppointments } from "@/lib/appointments-context"
import { generateNotifications } from "@/lib/notifications"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function NotificationBadge() {
  const { appointments } = useAppointments()
  const notifications = generateNotifications(appointments)
  const unreadCount = notifications.length

  return (
    <Link href="/dashboard/notifications">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
