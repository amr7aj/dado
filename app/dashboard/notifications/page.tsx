"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardBackground } from "@/components/dashboard-background"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { NotificationCard } from "@/components/notification-card"
import { useAppointments } from "@/lib/appointments-context"
import { generateNotifications } from "@/lib/notifications"
import { Bell, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificationsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { appointments } = useAppointments()

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

  const allNotifications = generateNotifications(appointments)
  const todayNotifications = allNotifications.filter((n) => n.type === "today")
  const tomorrowNotifications = allNotifications.filter((n) => n.type === "tomorrow")
  const upcomingNotifications = allNotifications.filter((n) => n.type === "upcoming")
  const overdueNotifications = allNotifications.filter((n) => n.type === "overdue")

  return (
    <div className="min-h-screen">
      <DashboardBackground />

      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">التنبيهات</h1>
              <p className="text-muted-foreground">تنبيهات المواعيد القادمة والتذكيرات</p>
            </div>

            {allNotifications.length === 0 ? (
              <Card className="border-primary/20 bg-card/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد تنبيهات</h3>
                  <p className="text-muted-foreground">جميع مواعيدك منظمة! لا توجد تنبيهات عاجلة في الوقت الحالي.</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="bg-card/90 backdrop-blur-sm border border-border">
                  <TabsTrigger value="all" className="gap-2">
                    <Bell className="w-4 h-4" />
                    الكل ({allNotifications.length})
                  </TabsTrigger>
                  {overdueNotifications.length > 0 && (
                    <TabsTrigger value="overdue" className="gap-2 text-red-600">
                      فائت ({overdueNotifications.length})
                    </TabsTrigger>
                  )}
                  {todayNotifications.length > 0 && (
                    <TabsTrigger value="today" className="gap-2">
                      اليوم ({todayNotifications.length})
                    </TabsTrigger>
                  )}
                  {tomorrowNotifications.length > 0 && (
                    <TabsTrigger value="tomorrow" className="gap-2">
                      غداً ({tomorrowNotifications.length})
                    </TabsTrigger>
                  )}
                  {upcomingNotifications.length > 0 && (
                    <TabsTrigger value="upcoming" className="gap-2">
                      قادم ({upcomingNotifications.length})
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {allNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </TabsContent>

                {overdueNotifications.length > 0 && (
                  <TabsContent value="overdue" className="space-y-4">
                    {overdueNotifications.map((notification) => (
                      <NotificationCard key={notification.id} notification={notification} />
                    ))}
                  </TabsContent>
                )}

                {todayNotifications.length > 0 && (
                  <TabsContent value="today" className="space-y-4">
                    {todayNotifications.map((notification) => (
                      <NotificationCard key={notification.id} notification={notification} />
                    ))}
                  </TabsContent>
                )}

                {tomorrowNotifications.length > 0 && (
                  <TabsContent value="tomorrow" className="space-y-4">
                    {tomorrowNotifications.map((notification) => (
                      <NotificationCard key={notification.id} notification={notification} />
                    ))}
                  </TabsContent>
                )}

                {upcomingNotifications.length > 0 && (
                  <TabsContent value="upcoming" className="space-y-4">
                    {upcomingNotifications.map((notification) => (
                      <NotificationCard key={notification.id} notification={notification} />
                    ))}
                  </TabsContent>
                )}
              </Tabs>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
