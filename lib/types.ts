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

export interface Case {
  id: string
  name: string
  caseNumber: string
  type: "مدني" | "جزائي" | "إداري" | "تجاري" | "أحوال شخصية" | "عمالي" | "أخرى"
  clientId: string
  clientName: string
  court: string
  nextSessionDate?: string
  nextSessionTime?: string
  status: "نشطة" | "معلقة" | "مغلقة" | "مؤجلة"
  fees: number
  paidAmount: number
  notes?: string
  createdAt: string
  userId: string
}

export interface Task {
  id: string
  title: string
  description?: string
  caseId?: string
  caseName?: string
  dueDate: string
  priority: "عالية" | "متوسطة" | "منخفضة"
  status: "بانتظار" | "منجزة" | "مؤجلة"
  createdAt: string
  userId: string
}

export interface LawyerProfile {
  id: string
  name: string
  officeNumber?: string
  phone?: string
  email?: string
  specialization?: string
  logo?: string
  signature?: string
  userId: string
}
