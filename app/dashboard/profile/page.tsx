"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardBackground } from "@/components/dashboard-background"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Building2, Phone, Mail, MapPin, FileText, Save } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { profile, updateProfile } = useData()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    licenseNumber: "",
    officeAddress: "",
    phone: "",
    email: "",
    specialization: "",
    bio: "",
    website: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        licenseNumber: profile.licenseNumber || "",
        officeAddress: profile.officeAddress || "",
        phone: profile.phone || "",
        email: profile.email || "",
        specialization: profile.specialization || "",
        bio: profile.bio || "",
        website: profile.website || "",
      })
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }))
    }
  }, [profile, user])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(formData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen">
      <DashboardBackground />

      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-primary">الملف الشخصي</h1>
                  <p className="text-muted-foreground mt-1">معلوماتك المهنية والشخصية</p>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} className="bg-secondary hover:bg-secondary/90 shadow-lg">
                    تعديل الملف الشخصي
                  </Button>
                )}
              </div>

              <Card className="p-6 border-primary/20 bg-card/90 backdrop-blur-sm">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          الاسم الكامل
                        </Label>
                        <Input
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          رقم الترخيص
                        </Label>
                        <Input
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          رقم الهاتف
                        </Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          البريد الإلكتروني
                        </Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          عنوان المكتب
                        </Label>
                        <Input
                          value={formData.officeAddress}
                          onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label>التخصص</Label>
                        <Input
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          placeholder="مثال: قانون مدني، قانون جنائي، قانون تجاري"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label>الموقع الإلكتروني</Label>
                        <Input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label>نبذة تعريفية</Label>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={4}
                          placeholder="اكتب نبذة مختصرة عن خبراتك ومجالات عملك..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        إلغاء
                      </Button>
                      <Button type="submit" className="gap-2">
                        <Save className="h-4 w-4" />
                        حفظ التغييرات
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{formData.fullName || "لم يتم تعيين الاسم"}</h2>
                        {formData.specialization && <p className="text-muted-foreground">{formData.specialization}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formData.licenseNumber && (
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-sm text-muted-foreground">رقم الترخيص</div>
                            <div className="font-medium">{formData.licenseNumber}</div>
                          </div>
                        </div>
                      )}

                      {formData.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-sm text-muted-foreground">رقم الهاتف</div>
                            <div className="font-medium">{formData.phone}</div>
                          </div>
                        </div>
                      )}

                      {formData.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-sm text-muted-foreground">البريد الإلكتروني</div>
                            <div className="font-medium">{formData.email}</div>
                          </div>
                        </div>
                      )}

                      {formData.officeAddress && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-sm text-muted-foreground">عنوان المكتب</div>
                            <div className="font-medium">{formData.officeAddress}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {formData.bio && (
                      <div className="pt-6 border-t">
                        <h3 className="font-semibold mb-2">نبذة تعريفية</h3>
                        <p className="text-muted-foreground leading-relaxed">{formData.bio}</p>
                      </div>
                    )}

                    {formData.website && (
                      <div className="pt-6 border-t">
                        <h3 className="font-semibold mb-2">الموقع الإلكتروني</h3>
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {formData.website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
