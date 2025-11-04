"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Case, Task, LawyerProfile } from "./types"
import { useAuth } from "./auth-context"

interface DataContextType {
  cases: Case[]
  tasks: Task[]
  profile: LawyerProfile | null
  addCase: (caseData: Omit<Case, "id" | "createdAt" | "userId">) => void
  updateCase: (id: string, caseData: Partial<Case>) => void
  deleteCase: (id: string) => void
  addTask: (task: Omit<Task, "id" | "createdAt" | "userId">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  updateProfile: (profile: Partial<LawyerProfile>) => void
  searchAll: (query: string) => {
    cases: Case[]
    tasks: Task[]
    clients: any[]
    appointments: any[]
  }
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [profile, setProfile] = useState<LawyerProfile | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const storedCases = localStorage.getItem(`cases-${user.id}`)
      const storedTasks = localStorage.getItem(`tasks-${user.id}`)
      const storedProfile = localStorage.getItem(`profile-${user.id}`)

      if (storedCases) setCases(JSON.parse(storedCases))
      if (storedTasks) setTasks(JSON.parse(storedTasks))
      if (storedProfile) setProfile(JSON.parse(storedProfile))
    }
  }, [user])

  const saveCases = (newCases: Case[]) => {
    if (user) {
      localStorage.setItem(`cases-${user.id}`, JSON.stringify(newCases))
      setCases(newCases)
    }
  }

  const saveTasks = (newTasks: Task[]) => {
    if (user) {
      localStorage.setItem(`tasks-${user.id}`, JSON.stringify(newTasks))
      setTasks(newTasks)
    }
  }

  const saveProfile = (newProfile: LawyerProfile) => {
    if (user) {
      localStorage.setItem(`profile-${user.id}`, JSON.stringify(newProfile))
      setProfile(newProfile)
    }
  }

  const addCase = (caseData: Omit<Case, "id" | "createdAt" | "userId">) => {
    if (!user) return
    const newCase: Case = {
      ...caseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.id,
    }
    saveCases([...cases, newCase])
  }

  const updateCase = (id: string, caseData: Partial<Case>) => {
    saveCases(cases.map((c) => (c.id === id ? { ...c, ...caseData } : c)))
  }

  const deleteCase = (id: string) => {
    saveCases(cases.filter((c) => c.id !== id))
  }

  const addTask = (task: Omit<Task, "id" | "createdAt" | "userId">) => {
    if (!user) return
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.id,
    }
    saveTasks([...tasks, newTask])
  }

  const updateTask = (id: string, task: Partial<Task>) => {
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, ...task } : t)))
  }

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((t) => t.id !== id))
  }

  const updateProfile = (profileData: Partial<LawyerProfile>) => {
    if (!user) return
    const newProfile: LawyerProfile = {
      ...profile,
      ...profileData,
      id: profile?.id || Date.now().toString(),
      userId: user.id,
    } as LawyerProfile
    saveProfile(newProfile)
  }

  const searchAll = (query: string) => {
    const lowerQuery = query.toLowerCase()

    const filteredCases = cases.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.caseNumber.toLowerCase().includes(lowerQuery) ||
        c.clientName.toLowerCase().includes(lowerQuery),
    )

    const filteredTasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQuery) ||
        t.description?.toLowerCase().includes(lowerQuery) ||
        t.caseName?.toLowerCase().includes(lowerQuery),
    )

    const storedClients = localStorage.getItem(`clients-${user?.id}`)
    const clients = storedClients ? JSON.parse(storedClients) : []
    const filteredClients = clients.filter(
      (c: any) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.phone.toLowerCase().includes(lowerQuery) ||
        c.email?.toLowerCase().includes(lowerQuery),
    )

    const storedAppointments = localStorage.getItem(`appointments-${user?.id}`)
    const appointments = storedAppointments ? JSON.parse(storedAppointments) : []
    const filteredAppointments = appointments.filter(
      (a: any) =>
        a.clientName.toLowerCase().includes(lowerQuery) ||
        a.title.toLowerCase().includes(lowerQuery) ||
        a.caseNumber?.toLowerCase().includes(lowerQuery),
    )

    return {
      cases: filteredCases,
      tasks: filteredTasks,
      clients: filteredClients,
      appointments: filteredAppointments,
    }
  }

  return (
    <DataContext.Provider
      value={{
        cases,
        tasks,
        profile,
        addCase,
        updateCase,
        deleteCase,
        addTask,
        updateTask,
        deleteTask,
        updateProfile,
        searchAll,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
