"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppointments } from "@/lib/appointments-context"
import { Calendar, Clock, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface AppointmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: string
}

export function AppointmentForm({ open, onOpenChange, selectedDate }: AppointmentFormProps) {
  const { addAppointment, clients, addClient } = useAppointments()
  const [isNewClient, setIsNewClient] = useState(false)
  const [hasNextAppointment, setHasNextAppointment] = useState(false)

  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    newClientName: "",
    newClientPhone: "",
    newClientEmail: "",
    title: "",
    description: "",
    date: selectedDate || new Date().toISOString().split("T")[0],
    time: "09:00",
    type: "court-session" as const,
    location: "",
    caseNumber: "",
    nextAppointmentDate: "",
    nextAppointmentTime: "09:00",
    nextAppointmentDescription: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let clientId = formData.clientId
    let clientName = formData.clientName

    if (isNewClient && formData.newClientName) {
      addClient({
        name: formData.newClientName,
        phone: formData.newClientPhone,
        email: formData.newClientEmail,
      })
      clientId = Date.now().toString()
      clientName = formData.newClientName
    } else {
      const selectedClient = clients.find((c) => c.id === formData.clientId)
      if (selectedClient) {
        clientName = selectedClient.name
      }
    }

    addAppointment({
      clientId,
      clientName,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: "scheduled",
      location: formData.location,
      caseNumber: formData.caseNumber,
      nextAppointment: hasNextAppointment
        ? {
            date: formData.nextAppointmentDate,
            time: formData.nextAppointmentTime,
            description: formData.nextAppointmentDescription,
          }
        : undefined,
    })

    onOpenChange(false)
    setFormData({
      clientId: "",
      clientName: "",
      newClientName: "",
      newClientPhone: "",
      newClientEmail: "",
      title: "",
      description: "",
      date: selectedDate || new Date().toISOString().split("T")[0],
      time: "09:00",
      type: "court-session",
      location: "",
      caseNumber: "",
      nextAppointmentDate: "",
      nextAppointmentTime: "09:00",
      nextAppointmentDescription: "",
    })
    setIsNewClient(false)
    setHasNextAppointment(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">إضافة موعد جديد</DialogTitle>
          <DialogDescription>أضف جلسة محكمة أو موعد استشارة مع العميل</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              id="newClient"
              checked={isNewClient}
              onCheckedChange={(checked) => setIsNewClient(checked as boolean)}
            />
            <Label htmlFor="newClient" className="cursor-pointer">
              عميل جديد
            </Label>
          </div>

          {isNewClient ? (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <Label htmlFor="newClientName">اسم العميل *</Label>
                <Input
                  id="newClientName"
                  value={formData.newClientName}
                  onChange={(e) => setFormData({ ...formData, newClientName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newClientPhone">رقم الهاتف *</Label>
                <Input
                  id="newClientPhone"
                  value={formData.newClientPhone}
                  onChange={(e) => setFormData({ ...formData, newClientPhone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newClientEmail">البريد الإلكتروني</Label>
                <Input
                  id="newClientEmail"
                  type="email"
                  value={formData.newClientEmail}
                  onChange={(e) => setFormData({ ...formData, newClientEmail: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="client">اختر العميل *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر عميل من القائمة" />
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
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ *</Label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">الوقت *</Label>
              <div className="relative">
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="pr-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">نوع الموعد *</Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="court-session">جلسة محكمة</SelectItem>
                <SelectItem value="consultation">استشارة</SelectItem>
                <SelectItem value="meeting">اجتماع</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">عنوان الموعد *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: جلسة محكمة - قضية رقم 123"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caseNumber">رقم القضية</Label>
              <Input
                id="caseNumber"
                value={formData.caseNumber}
                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">المكان</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="مثال: محكمة الجنايات"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">ملاحظات</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="hasNextAppointment"
              checked={hasNextAppointment}
              onCheckedChange={(checked) => setHasNextAppointment(checked as boolean)}
            />
            <Label htmlFor="hasNextAppointment" className="cursor-pointer">
              تحديد موعد تالي
            </Label>
          </div>

          {hasNextAppointment && (
            <div className="space-y-4 p-4 border border-secondary/30 rounded-lg bg-secondary/5">
              <h4 className="font-semibold text-secondary">الموعد التالي</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nextDate">التاريخ</Label>
                  <Input
                    id="nextDate"
                    type="date"
                    value={formData.nextAppointmentDate}
                    onChange={(e) => setFormData({ ...formData, nextAppointmentDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextTime">الوقت</Label>
                  <Input
                    id="nextTime"
                    type="time"
                    value={formData.nextAppointmentTime}
                    onChange={(e) => setFormData({ ...formData, nextAppointmentTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextDescription">وصف الموعد التالي</Label>
                <Textarea
                  id="nextDescription"
                  value={formData.nextAppointmentDescription}
                  onChange={(e) => setFormData({ ...formData, nextAppointmentDescription: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90">
              <Plus className="w-4 h-4 ml-2" />
              إضافة الموعد
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
