"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Briefcase, DollarSign, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardBackground } from "@/components/dashboard-background"
import { useData } from "@/lib/data-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppointments } from "@/lib/appointments-context"
import type { Case } from "@/lib/types"

export default function CasesPage() {
  const { cases, addCase, updateCase, deleteCase } = useData()
  const { clients } = useAppointments()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<Case | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    caseNumber: "",
    type: "مدني" as Case["type"],
    clientId: "",
    clientName: "",
    court: "",
    nextSessionDate: "",
    nextSessionTime: "",
    status: "نشطة" as Case["status"],
    fees: 0,
    paidAmount: 0,
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCase) {
      updateCase(editingCase.id, formData)
      setEditingCase(null)
    } else {
      addCase(formData)
    }
    setIsAddDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      caseNumber: "",
      type: "مدني",
      clientId: "",
      clientName: "",
      court: "",
      nextSessionDate: "",
      nextSessionTime: "",
      status: "نشطة",
      fees: 0,
      paidAmount: 0,
      notes: "",
    })
  }

  const handleEdit = (caseItem: Case) => {
    setEditingCase(caseItem)
    setFormData({
      name: caseItem.name,
      caseNumber: caseItem.caseNumber,
      type: caseItem.type,
      clientId: caseItem.clientId,
      clientName: caseItem.clientName,
      court: caseItem.court,
      nextSessionDate: caseItem.nextSessionDate || "",
      nextSessionTime: caseItem.nextSessionTime || "",
      status: caseItem.status,
      fees: caseItem.fees,
      paidAmount: caseItem.paidAmount,
      notes: caseItem.notes || "",
    })
    setIsAddDialogOpen(true)
  }

  const getStatusColor = (status: Case["status"]) => {
    switch (status) {
      case "نشطة":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "معلقة":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "مغلقة":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      case "مؤجلة":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  const activeCases = cases.filter((c) => c.status === "نشطة").length
  const totalFees = cases.reduce((sum, c) => sum + c.fees, 0)
  const totalPaid = cases.reduce((sum, c) => sum + c.paidAmount, 0)

  return (
    <div className="min-h-screen flex">
      <DashboardBackground />
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">القضايا</h1>
                <p className="text-muted-foreground">إدارة ومتابعة القضايا القانونية</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={resetForm}>
                    <Plus className="w-4 h-4" />
                    إضافة قضية
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingCase ? "تعديل القضية" : "إضافة قضية جديدة"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم القضية</Label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>رقم القضية</Label>
                        <Input
                          required
                          value={formData.caseNumber}
                          onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>نوع القضية</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: Case["type"]) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="مدني">مدني</SelectItem>
                            <SelectItem value="جزائي">جزائي</SelectItem>
                            <SelectItem value="إداري">إداري</SelectItem>
                            <SelectItem value="تجاري">تجاري</SelectItem>
                            <SelectItem value="أحوال شخصية">أحوال شخصية</SelectItem>
                            <SelectItem value="عمالي">عمالي</SelectItem>
                            <SelectItem value="أخرى">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>الحالة</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: Case["status"]) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="نشطة">نشطة</SelectItem>
                            <SelectItem value="معلقة">معلقة</SelectItem>
                            <SelectItem value="مغلقة">مغلقة</SelectItem>
                            <SelectItem value="مؤجلة">مؤجلة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>العميل</Label>
                      <Select
                        value={formData.clientId}
                        onValueChange={(value) => {
                          const client = clients.find((c) => c.id === value)
                          setFormData({ ...formData, clientId: value, clientName: client?.name || "" })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العميل" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>المحكمة</Label>
                      <Input
                        required
                        value={formData.court}
                        onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>تاريخ الجلسة القادمة</Label>
                        <Input
                          type="date"
                          value={formData.nextSessionDate}
                          onChange={(e) => setFormData({ ...formData, nextSessionDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>وقت الجلسة</Label>
                        <Input
                          type="time"
                          value={formData.nextSessionTime}
                          onChange={(e) => setFormData({ ...formData, nextSessionTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>الأتعاب المتفق عليها</Label>
                        <Input
                          type="number"
                          value={formData.fees}
                          onChange={(e) => setFormData({ ...formData, fees: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>المبلغ المدفوع</Label>
                        <Input
                          type="number"
                          value={formData.paidAmount}
                          onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>ملاحظات</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button type="submit">{editingCase ? "تحديث" : "إضافة"}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">القضايا النشطة</p>
                    <p className="text-3xl font-bold text-green-600">{activeCases}</p>
                  </div>
                  <Briefcase className="w-12 h-12 text-green-500/50" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">إجمالي الأتعاب</p>
                    <p className="text-3xl font-bold text-blue-600">{totalFees.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-blue-500/50" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">المبالغ المحصلة</p>
                    <p className="text-3xl font-bold text-purple-600">{totalPaid.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-purple-500/50" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleEdit(caseItem)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{caseItem.name}</h3>
                        <p className="text-sm text-muted-foreground">رقم: {caseItem.caseNumber}</p>
                      </div>
                      <Badge className={getStatusColor(caseItem.status)}>{caseItem.status}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span>{caseItem.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{caseItem.clientName}</span>
                      </div>
                      {caseItem.nextSessionDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {new Date(caseItem.nextSessionDate).toLocaleDateString("ar-EG")}
                            {caseItem.nextSessionTime && ` - ${caseItem.nextSessionTime}`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">الأتعاب:</span>
                        <span className="font-semibold">{caseItem.fees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">المدفوع:</span>
                        <span className="font-semibold text-green-600">{caseItem.paidAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">المتبقي:</span>
                        <span className="font-semibold text-orange-600">
                          {(caseItem.fees - caseItem.paidAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm("هل أنت متأكد من حذف هذه القضية؟")) {
                          deleteCase(caseItem.id)
                        }
                      }}
                    >
                      حذف القضية
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {cases.length === 0 && (
              <Card className="p-12 text-center">
                <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">لا توجد قضايا بعد</h3>
                <p className="text-muted-foreground mb-4">ابدأ بإضافة قضية جديدة لتتبع القضايا القانونية</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة قضية
                </Button>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
