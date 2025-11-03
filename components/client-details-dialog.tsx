"use client"

import type { Client } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppointments } from "@/lib/appointments-context"
import { Phone, Mail, FileText, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppointmentList } from "@/components/appointment-list"

interface ClientDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
}

export function ClientDetailsDialog({ open, onOpenChange, client }: ClientDetailsDialogProps) {
  const { appointments } = useAppointments()

  if (!client) return null

  const clientAppointments = appointments.filter((apt) => apt.clientId === client.id)
  const upcomingAppointments = clientAppointments.filter(
    (apt) => apt.status === "scheduled" && apt.date >= new Date().toISOString().split("T")[0],
  )
  const completedAppointments = clientAppointments.filter((apt) => apt.status === "completed")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">تفاصيل العميل</DialogTitle>
          <DialogDescription>معلومات العميل والمواعيد المرتبطة به</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info Card */}
          <Card className="border-primary/20 bg-card/90">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-2xl flex-shrink-0">
                  {getInitials(client.name)}
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold text-primary">{client.name}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>

                    {client.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{client.email}</span>
                      </div>
                    )}

                    {client.caseNumber && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>قضية رقم: {client.caseNumber}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{clientAppointments.length} موعد</span>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{client.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-primary/20 bg-card/90">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{clientAppointments.length}</p>
                <p className="text-sm text-muted-foreground">إجمالي المواعيد</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-card/90">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-secondary">{upcomingAppointments.length}</p>
                <p className="text-sm text-muted-foreground">مواعيد قادمة</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-card/90">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{completedAppointments.length}</p>
                <p className="text-sm text-muted-foreground">مواعيد مكتملة</p>
              </CardContent>
            </Card>
          </div>

          {/* Appointments */}
          <Card className="border-primary/20 bg-card/90">
            <CardHeader>
              <CardTitle>المواعيد</CardTitle>
            </CardHeader>
            <CardContent>
              {clientAppointments.length > 0 ? (
                <AppointmentList appointments={clientAppointments} />
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">لا توجد مواعيد لهذا العميل</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
