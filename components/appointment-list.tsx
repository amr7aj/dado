"use client"

import type { Appointment } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, FileText, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { useAppointments } from "@/lib/appointments-context"
import { Badge } from "@/components/ui/badge"

interface AppointmentListProps {
  appointments: Appointment[]
  selectedDate?: string
}

export function AppointmentList({ appointments, selectedDate }: AppointmentListProps) {
  const { deleteAppointment, updateAppointment } = useAppointments()

  const getTypeLabel = (type: string) => {
    const labels = {
      "court-session": "جلسة محكمة",
      consultation: "استشارة",
      meeting: "اجتماع",
      other: "أخرى",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "court-session": "bg-primary/10 text-primary border-primary/20",
      consultation: "bg-secondary/10 text-secondary border-secondary/20",
      meeting: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      other: "bg-muted text-muted-foreground border-border",
    }
    return colors[type as keyof typeof colors] || colors.other
  }

  const handleComplete = (id: string) => {
    updateAppointment(id, { status: "completed" })
  }

  if (appointments.length === 0) {
    return (
      <Card className="border-primary/20 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {selectedDate ? "لا توجد مواعيد في هذا اليوم" : "لا توجد مواعيد"}
          </h3>
          <p className="text-muted-foreground">ابدأ بإضافة موعد جديد من الزر أعلاه</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card
          key={appointment.id}
          className="border-primary/20 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary mb-1">{appointment.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">العميل: {appointment.clientName}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={getTypeColor(appointment.type)}>
                        {getTypeLabel(appointment.type)}
                      </Badge>
                      {appointment.status === "completed" && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          مكتمل
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </div>
                  {appointment.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.location}</span>
                    </div>
                  )}
                  {appointment.caseNumber && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>قضية رقم: {appointment.caseNumber}</span>
                    </div>
                  )}
                </div>

                {appointment.description && (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{appointment.description}</p>
                )}

                {appointment.nextAppointment && (
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-semibold text-secondary">الموعد التالي</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        التاريخ: {appointment.nextAppointment.date} - {appointment.nextAppointment.time}
                      </p>
                      {appointment.nextAppointment.description && <p>{appointment.nextAppointment.description}</p>}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {appointment.status === "scheduled" && (
                  <Button size="sm" variant="outline" onClick={() => handleComplete(appointment.id)} className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    إكمال
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteAppointment(appointment.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
