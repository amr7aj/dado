"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardBackground } from "@/components/dashboard-background"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { Calendar, Users, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppointments } from "@/lib/appointments-context"
import { AppointmentList } from "@/components/appointment-list"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { appointments, clients, getTodayAppointments, getUpcomingAppointments } = useAppointments()

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

  const todayAppointments = getTodayAppointments()
  const upcomingAppointments = getUpcomingAppointments().slice(0, 5)
  const completedThisMonth = appointments.filter((apt) => {
    const aptDate = new Date(apt.date)
    const now = new Date()
    return (
      apt.status === "completed" && aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear()
    )
  }).length

  return (
    <div className="min-h-screen">
      <DashboardBackground />

      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col lg:mr-0">
          <DashboardHeader />

          <main className="flex-1 p-4 md:p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-slide-in-up">
              <StatCard
                title="المواعيد اليوم"
                value={todayAppointments.length}
                icon={Calendar}
                description={
                  todayAppointments.length === 0 ? "لا توجد مواعيد اليوم" : `${todayAppointments.length} موعد مجدول`
                }
              />
              <StatCard
                title="إجمالي العملاء"
                value={clients.length}
                icon={Users}
                description={clients.length === 0 ? "ابدأ بإضافة عملاء" : `${clients.length} عميل نشط`}
              />
              <StatCard
                title="المواعيد القادمة"
                value={upcomingAppointments.length}
                icon={Clock}
                description="خلال الفترة القادمة"
              />
              <StatCard
                title="الجلسات المكتملة"
                value={completedThisMonth}
                icon={CheckCircle}
                description="هذا الشهر"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="border-primary/20 bg-card/90 backdrop-blur-sm animate-slide-in-up hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">المواعيد القادمة</CardTitle>
                  <CardDescription>جلساتك المجدولة للأيام القادمة</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <AppointmentList appointments={upcomingAppointments} />
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">لا توجد مواعيد مجدولة</p>
                      <p className="text-sm text-muted-foreground mt-1">انتقل إلى الأجندة لإضافة موعد جديد</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/90 backdrop-blur-sm animate-slide-in-up hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">مواعيد اليوم</CardTitle>
                  <CardDescription>الجلسات المجدولة لهذا اليوم</CardDescription>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length > 0 ? (
                    <AppointmentList appointments={todayAppointments} />
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">لا توجد مواعيد اليوم</p>
                      <p className="text-sm text-muted-foreground mt-1">استمتع بيومك!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Welcome Message */}
            <Card className="border-secondary/30 bg-gradient-to-br from-secondary/10 to-secondary/5 backdrop-blur-sm animate-slide-in-up hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base md:text-lg font-semibold text-primary">مرحباً بك في نظام أجندة المحامي</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      يمكنك الآن إدارة مواعيدك وجلساتك القانونية بكل سهولة. ابدأ بإضافة عملائك وجدولة المواعيد من قسم
                      الأجندة. سيقوم النظام بتذكيرك تلقائياً بالمواعيد القادمة.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
