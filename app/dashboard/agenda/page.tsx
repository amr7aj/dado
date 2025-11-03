"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardBackground } from "@/components/dashboard-background"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { CalendarView } from "@/components/calendar-view"
import { AppointmentForm } from "@/components/appointment-form"
import { AppointmentList } from "@/components/appointment-list"
import { useAppointments } from "@/lib/appointments-context"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AgendaPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { getAppointmentsByDate } = useAppointments()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  const appointments = getAppointmentsByDate(selectedDate)

  return (
    <div className="min-h-screen">
      <DashboardBackground />

      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">الأجندة</h1>
                <p className="text-muted-foreground">إدارة المواعيد والجلسات القانونية</p>
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gap-2 bg-secondary hover:bg-secondary/90 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                موعد جديد
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              </div>

              <div className="lg:col-span-2">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-primary">
                    المواعيد في{" "}
                    {new Date(selectedDate).toLocaleDateString("ar-EG", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                </div>
                <AppointmentList appointments={appointments} selectedDate={selectedDate} />
              </div>
            </div>
          </main>
        </div>
      </div>

      <AppointmentForm open={isFormOpen} onOpenChange={setIsFormOpen} selectedDate={selectedDate} />
    </div>
  )
}
