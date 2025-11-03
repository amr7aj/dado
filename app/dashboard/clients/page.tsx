"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardBackground } from "@/components/dashboard-background"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ClientCard } from "@/components/client-card"
import { ClientForm } from "@/components/client-form"
import { ClientDetailsDialog } from "@/components/client-details-dialog"
import { useAppointments } from "@/lib/appointments-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users } from "lucide-react"
import type { Client } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

export default function ClientsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { clients, appointments, deleteClient } = useAppointments()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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

  const getClientAppointmentCount = (clientId: string) => {
    return appointments.filter((apt) => apt.clientId === clientId).length
  }

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setIsFormOpen(true)
  }

  const handleDelete = (clientId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العميل؟")) {
      deleteClient(clientId)
    }
  }

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client)
    setIsDetailsOpen(true)
  }

  const handleAddNew = () => {
    setSelectedClient(null)
    setIsFormOpen(true)
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.caseNumber?.includes(searchQuery),
  )

  return (
    <div className="min-h-screen">
      <DashboardBackground />

      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">العملاء</h1>
                <p className="text-muted-foreground">إدارة قائمة العملاء ومعلوماتهم</p>
              </div>
              <Button onClick={handleAddNew} className="gap-2 bg-secondary hover:bg-secondary/90 shadow-lg">
                <Plus className="w-5 h-5" />
                عميل جديد
              </Button>
            </div>

            {/* Search Bar */}
            <Card className="border-primary/20 bg-card/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن عميل (الاسم، الهاتف، البريد، رقم القضية...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 h-12"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Clients Grid */}
            {filteredClients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    appointmentCount={getClientAppointmentCount(client.id)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-primary/20 bg-card/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchQuery ? "لا توجد نتائج" : "لا يوجد عملاء"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "جرب البحث بكلمات مختلفة" : "ابدأ بإضافة عميل جديد من الزر أعلاه"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleAddNew} className="gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة عميل جديد
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      <ClientForm open={isFormOpen} onOpenChange={setIsFormOpen} client={selectedClient} />

      <ClientDetailsDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} client={selectedClient} />
    </div>
  )
}
