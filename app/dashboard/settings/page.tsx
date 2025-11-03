"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardBackground } from "@/components/dashboard-background"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"
import { Moon, Sun, User, Mail, Calendar, UsersIcon, Clock, Lock, ShieldAlert, ShieldCheck, Key } from "lucide-react"

const ADMIN_CODE = "1382002"

interface RegisteredUser {
  id: string
  name: string
  email: string
  registeredAt: string
  blocked?: boolean
}

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [adminCode, setAdminCode] = useState("")
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminError, setAdminError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const users = localStorage.getItem("lawyer-agenda-users")
    if (users) {
      const parsedUsers = JSON.parse(users)
      const usersWithTimestamp = parsedUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        registeredAt: u.registeredAt || new Date().toISOString(),
        blocked: u.blocked || false,
      }))
      setRegisteredUsers(usersWithTimestamp)
    }

    const savedNotifications = localStorage.getItem("lawyer-agenda-notifications")
    if (savedNotifications !== null) {
      setNotificationsEnabled(JSON.parse(savedNotifications))
    }
  }, [])

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled)
    localStorage.setItem("lawyer-agenda-notifications", JSON.stringify(enabled))
  }

  const handleAdminAuth = () => {
    if (adminCode === ADMIN_CODE) {
      setIsAdminAuthenticated(true)
      setAdminError("")
    } else {
      setAdminError("رمز المسؤول غير صحيح")
    }
  }

  const handleToggleBlock = (userId: string) => {
    const usersData = localStorage.getItem("lawyer-agenda-users")
    if (!usersData) return

    const users = JSON.parse(usersData)
    const updatedUsers = users.map((u: any) => {
      if (u.id === userId) {
        return { ...u, blocked: !u.blocked }
      }
      return u
    })

    localStorage.setItem("lawyer-agenda-users", JSON.stringify(updatedUsers))

    setRegisteredUsers(
      updatedUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        registeredAt: u.registeredAt,
        blocked: u.blocked || false,
      })),
    )
  }

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

  return (
    <div className="min-h-screen">
      <DashboardBackground />

      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 p-4 md:p-6 space-y-6">
            <div className="animate-slide-in-up">
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">الإعدادات</h1>
              <p className="text-muted-foreground">إدارة إعدادات الحساب والنظام</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-primary/20 bg-card/90 backdrop-blur-sm animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    معلومات الحساب
                  </CardTitle>
                  <CardDescription>بياناتك الشخصية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input id="name" value={user.name} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" value={user.email} disabled className="bg-muted" />
                  </div>
                  <p className="text-xs text-muted-foreground">لتعديل معلومات الحساب، يرجى التواصل مع الدعم الفني</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/90 backdrop-blur-sm animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    المظهر
                  </CardTitle>
                  <CardDescription>تخصيص مظهر الموقع</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>الوضع الداكن</Label>
                      <p className="text-sm text-muted-foreground">تفعيل الوضع الليلي للموقع</p>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      الوضع الحالي:{" "}
                      <span className="font-semibold text-foreground">{theme === "dark" ? "داكن" : "فاتح"}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/90 backdrop-blur-sm animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    التنبيهات
                  </CardTitle>
                  <CardDescription>إدارة إشعارات المواعيد</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تفعيل التنبيهات</Label>
                      <p className="text-sm text-muted-foreground">استلام إشعارات بالمواعيد القادمة</p>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationsToggle} />
                  </div>
                  <div className="space-y-2">
                    <Label>وقت التذكير</Label>
                    <p className="text-sm text-muted-foreground">سيتم تذكيرك بالمواعيد قبل يوم واحد</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/90 backdrop-blur-sm animate-slide-in-up lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5" />
                    المستخدمون المسجلون (للمسؤول فقط)
                  </CardTitle>
                  <CardDescription>قسم خاص بالمسؤول لإدارة المستخدمين المسجلين في النظام</CardDescription>
                </CardHeader>
                <CardContent>
                  {!isAdminAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                        <Lock className="w-5 h-5 text-secondary" />
                        <p className="text-sm text-muted-foreground">
                          هذا القسم محمي. يرجى إدخال رمز المسؤول للوصول إلى قائمة المستخدمين.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="adminCode" className="flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          رمز المسؤول
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="adminCode"
                            type="password"
                            placeholder="أدخل رمز المسؤول"
                            value={adminCode}
                            onChange={(e) => {
                              setAdminCode(e.target.value)
                              setAdminError("")
                            }}
                            className="font-mono"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAdminAuth()
                              }
                            }}
                          />
                          <Button onClick={handleAdminAuth} className="bg-secondary hover:bg-secondary/90">
                            فتح
                          </Button>
                        </div>
                        {adminError && (
                          <p className="text-sm text-destructive flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" />
                            {adminError}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-secondary" />
                          <p className="text-sm font-semibold text-secondary">تم التحقق من صلاحيات المسؤول</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsAdminAuthenticated(false)
                            setAdminCode("")
                          }}
                        >
                          إغلاق
                        </Button>
                      </div>

                      {registeredUsers.length > 0 ? (
                        <div className="space-y-3">
                          {registeredUsers.map((registeredUser) => (
                            <div
                              key={registeredUser.id}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border transition-all ${
                                registeredUser.blocked
                                  ? "bg-destructive/5 border-destructive/30"
                                  : "bg-muted/50 border-border hover:bg-muted"
                              }`}
                            >
                              <div className="flex items-start gap-3 mb-3 sm:mb-0">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    registeredUser.blocked ? "bg-destructive/20" : "bg-secondary"
                                  }`}
                                >
                                  <User
                                    className={`w-5 h-5 ${
                                      registeredUser.blocked ? "text-destructive" : "text-secondary-foreground"
                                    }`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-foreground">{registeredUser.name}</p>
                                    {registeredUser.blocked && (
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-semibold">
                                        محظور
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {registeredUser.email}
                                  </p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(registeredUser.registeredAt).toLocaleDateString("ar-EG", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant={registeredUser.blocked ? "default" : "destructive"}
                                size="sm"
                                onClick={() => handleToggleBlock(registeredUser.id)}
                                className="w-full sm:w-auto"
                              >
                                {registeredUser.blocked ? "إلغاء الحظر" : "حظر المستخدم"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">لا يوجد مستخدمون مسجلون بعد</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
