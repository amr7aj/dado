"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppointments } from "@/lib/appointments-context"
import type { Client } from "@/lib/types"
import { Plus, Save } from "lucide-react"

interface ClientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
}

export function ClientForm({ open, onOpenChange, client }: ClientFormProps) {
  const { addClient, updateClient } = useAppointments()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    caseNumber: "",
    notes: "",
  })

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        phone: client.phone,
        email: client.email || "",
        caseNumber: client.caseNumber || "",
        notes: client.notes || "",
      })
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        caseNumber: "",
        notes: "",
      })
    }
  }, [client, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (client) {
      updateClient(client.id, formData)
    } else {
      addClient(formData)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{client ? "تعديل بيانات العميل" : "إضافة عميل جديد"}</DialogTitle>
          <DialogDescription>
            {client ? "قم بتحديث معلومات العميل" : "أضف عميل جديد إلى قائمة العملاء"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="أحمد محمد"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+966 50 123 4567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="client@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseNumber">رقم القضية</Label>
            <Input
              id="caseNumber"
              value={formData.caseNumber}
              onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              placeholder="123/2025"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي ملاحظات إضافية عن العميل..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90">
              {client ? (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التعديلات
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة العميل
                </>
              )}
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
