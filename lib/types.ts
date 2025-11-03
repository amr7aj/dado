export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  caseNumber?: string
  notes?: string
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  title: string
  description?: string
  date: string
  time: string
  type: "court-session" | "consultation" | "meeting" | "other"
  status: "scheduled" | "completed" | "cancelled"
  location?: string
  caseNumber?: string
  nextAppointment?: {
    date: string
    time: string
    description: string
  }
  createdAt: string
  userId: string
}
