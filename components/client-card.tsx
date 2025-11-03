"use client"

import type { Client } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Phone, Mail, FileText, Trash2, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ClientCardProps {
  client: Client
  appointmentCount: number
  onEdit: (client: Client) => void
  onDelete: (id: string) => void
  onViewDetails: (client: Client) => void
}

export function ClientCard({ client, appointmentCount, onEdit, onDelete, onViewDetails }: ClientCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="border-primary/20 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-secondary-foreground font-bold text-lg">
            {getInitials(client.name)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-primary mb-1 truncate">{client.name}</h3>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{client.phone}</span>
              </div>

              {client.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}

              {client.caseNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">قضية: {client.caseNumber}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {appointmentCount} موعد
              </Badge>
            </div>

            {client.notes && (
              <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded line-clamp-2 mb-3">{client.notes}</p>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onViewDetails(client)} className="flex-1">
                <User className="w-4 h-4 ml-2" />
                التفاصيل
              </Button>
              <Button size="sm" variant="outline" onClick={() => onEdit(client)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(client.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
