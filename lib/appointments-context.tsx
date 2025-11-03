"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Appointment, Client } from "./types"
import { useAuth } from "./auth-context"

interface AppointmentsContextType {
  appointments: Appointment[]
  clients: Client[]
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt" | "userId">) => void
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
  addClient: (client: Omit<Client, "id">) => void
  updateClient: (id: string, client: Partial<Client>) => void
  deleteClient: (id: string) => void
  getAppointmentsByDate: (date: string) => Appointment[]
  getUpcomingAppointments: () => Appointment[]
  getTodayAppointments: () => Appointment[]
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const storedAppointments = localStorage.getItem(`appointments-${user.id}`)
      const storedClients = localStorage.getItem(`clients-${user.id}`)

      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments))
      }
      if (storedClients) {
        setClients(JSON.parse(storedClients))
      }
    }
  }, [user])

  const saveAppointments = (newAppointments: Appointment[]) => {
    if (user) {
      localStorage.setItem(`appointments-${user.id}`, JSON.stringify(newAppointments))
      setAppointments(newAppointments)
    }
  }

  const saveClients = (newClients: Client[]) => {
    if (user) {
      localStorage.setItem(`clients-${user.id}`, JSON.stringify(newClients))
      setClients(newClients)
    }
  }

  const addAppointment = (appointment: Omit<Appointment, "id" | "createdAt" | "userId">) => {
    if (!user) return

    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.id,
    }

    saveAppointments([...appointments, newAppointment])
  }

  const updateAppointment = (id: string, updatedData: Partial<Appointment>) => {
    const updated = appointments.map((apt) => (apt.id === id ? { ...apt, ...updatedData } : apt))
    saveAppointments(updated)
  }

  const deleteAppointment = (id: string) => {
    saveAppointments(appointments.filter((apt) => apt.id !== id))
  }

  const addClient = (client: Omit<Client, "id">) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
    }
    saveClients([...clients, newClient])
  }

  const updateClient = (id: string, updatedData: Partial<Client>) => {
    const updated = clients.map((client) => (client.id === id ? { ...client, ...updatedData } : client))
    saveClients(updated)
  }

  const deleteClient = (id: string) => {
    saveClients(clients.filter((client) => client.id !== id))
  }

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter((apt) => apt.date === date)
  }

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split("T")[0]
    return appointments.filter((apt) => apt.date === today && apt.status === "scheduled")
  }

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split("T")[0]
    return appointments
      .filter((apt) => apt.date >= today && apt.status === "scheduled")
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare !== 0) return dateCompare
        return a.time.localeCompare(b.time)
      })
  }

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        clients,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addClient,
        updateClient,
        deleteClient,
        getAppointmentsByDate,
        getUpcomingAppointments,
        getTodayAppointments,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentsProvider")
  }
  return context
}
