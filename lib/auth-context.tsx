"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  registeredAt?: string
  blocked?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, name?: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("lawyer-agenda-user")
    console.log("[v0] Checking stored user:", storedUser ? "Found" : "Not found")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      console.log("[v0] Login attempt for email:", email)

      const usersData = localStorage.getItem("lawyer-agenda-users")
      const users = usersData ? JSON.parse(usersData) : []

      console.log("[v0] Total registered users:", users.length)
      console.log(
        "[v0] Registered emails:",
        users.map((u: any) => u.email),
      )

      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        if (foundUser.blocked) {
          console.log("[v0] User is blocked:", email)
          return false
        }

        console.log("[v0] Login successful for:", email)
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          blocked: foundUser.blocked || false,
        }
        setUser(userData)
        localStorage.setItem("lawyer-agenda-user", JSON.stringify(userData))
        router.push("/dashboard")
        return true
      }

      const emailExists = users.find((u: any) => u.email === email)
      if (emailExists) {
        console.log("[v0] Email found but password incorrect")
      } else {
        console.log("[v0] Email not found in system")
      }

      return false
    } catch (error) {
      console.error("[v0] Login error:", error)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log("[v0] Signup attempt for email:", email)

      const usersData = localStorage.getItem("lawyer-agenda-users")
      const users = usersData ? JSON.parse(usersData) : []

      if (users.some((u: any) => u.email === email)) {
        console.log("[v0] Email already exists:", email)
        return false
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        registeredAt: new Date().toISOString(),
        blocked: false,
      }

      users.push(newUser)
      localStorage.setItem("lawyer-agenda-users", JSON.stringify(users))
      console.log("[v0] User created successfully:", email)

      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        blocked: false,
      }
      setUser(userData)
      localStorage.setItem("lawyer-agenda-user", JSON.stringify(userData))
      router.push("/dashboard")
      return true
    } catch (error) {
      console.error("[v0] Signup error:", error)
      return false
    }
  }

  const logout = () => {
    console.log("[v0] User logged out")
    setUser(null)
    localStorage.removeItem("lawyer-agenda-user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
