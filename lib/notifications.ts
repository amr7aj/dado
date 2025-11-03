import type { Appointment } from "./types"

export interface Notification {
  id: string
  appointmentId: string
  type: "today" | "tomorrow" | "upcoming" | "overdue"
  title: string
  message: string
  date: string
  time: string
  priority: "high" | "medium" | "low"
  read: boolean
}

export function generateNotifications(appointments: Appointment[]): Notification[] {
  const notifications: Notification[] = []
  const now = new Date()
  const today = now.toISOString().split("T")[0]
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  appointments
    .filter((apt) => apt.status === "scheduled")
    .forEach((apt) => {
      const aptDate = apt.date

      // Overdue appointments
      if (aptDate < today) {
        notifications.push({
          id: `notif-${apt.id}-overdue`,
          appointmentId: apt.id,
          type: "overdue",
          title: "موعد فائت",
          message: `لديك موعد فائت مع ${apt.clientName} - ${apt.title}`,
          date: apt.date,
          time: apt.time,
          priority: "high",
          read: false,
        })
      }
      // Today's appointments
      else if (aptDate === today) {
        notifications.push({
          id: `notif-${apt.id}-today`,
          appointmentId: apt.id,
          type: "today",
          title: "موعد اليوم",
          message: `لديك موعد اليوم مع ${apt.clientName} - ${apt.title}`,
          date: apt.date,
          time: apt.time,
          priority: "high",
          read: false,
        })
      }
      // Tomorrow's appointments
      else if (aptDate === tomorrow) {
        notifications.push({
          id: `notif-${apt.id}-tomorrow`,
          appointmentId: apt.id,
          type: "tomorrow",
          title: "موعد غداً",
          message: `لديك موعد غداً مع ${apt.clientName} - ${apt.title}`,
          date: apt.date,
          time: apt.time,
          priority: "medium",
          read: false,
        })
      }
      // Upcoming appointments (within next week)
      else if (aptDate > tomorrow && aptDate <= nextWeek) {
        const daysUntil = Math.ceil((new Date(aptDate).getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        notifications.push({
          id: `notif-${apt.id}-upcoming`,
          appointmentId: apt.id,
          type: "upcoming",
          title: "موعد قادم",
          message: `لديك موعد بعد ${daysUntil} أيام مع ${apt.clientName} - ${apt.title}`,
          date: apt.date,
          time: apt.time,
          priority: "low",
          read: false,
        })
      }

      // Check for next appointments
      if (apt.nextAppointment) {
        const nextAptDate = apt.nextAppointment.date
        if (nextAptDate >= today && nextAptDate <= nextWeek) {
          const daysUntil = Math.ceil((new Date(nextAptDate).getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
          notifications.push({
            id: `notif-${apt.id}-next`,
            appointmentId: apt.id,
            type: "upcoming",
            title: "موعد تالي قادم",
            message: `الموعد التالي مع ${apt.clientName} بعد ${daysUntil} أيام`,
            date: apt.nextAppointment.date,
            time: apt.nextAppointment.time,
            priority: "medium",
            read: false,
          })
        }
      }
    })

  return notifications.sort((a, b) => {
    // Sort by priority first
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff

    // Then by date
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare

    // Then by time
    return a.time.localeCompare(b.time)
  })
}
