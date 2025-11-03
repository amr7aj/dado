"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthBackground } from "@/components/auth-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("يرجى ملء جميع الحقول")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح")
      setIsLoading(false)
      return
    }

    const success = await login(email, password)

    if (!success) {
      const usersData = localStorage.getItem("lawyer-agenda-users")
      const users = usersData ? JSON.parse(usersData) : []
      const foundUser = users.find((u: any) => u.email === email)

      if (foundUser && foundUser.blocked) {
        setError("تم حظر هذا الحساب. يرجى التواصل مع الإدارة.")
      } else {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة. إذا لم يكن لديك حساب، يرجى إنشاء حساب جديد.")
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthBackground />

      <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 hover:shadow-3xl transition-shadow">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-500 shadow-lg">
            <Scale className="w-8 h-8 text-secondary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary animate-in fade-in duration-700">
            أجندة المحامي
          </CardTitle>
          <CardDescription className="text-base animate-in fade-in duration-700 delay-100">
            نظام إدارة المواعيد والجلسات القانونية
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2 animate-in slide-in-from-right-4 duration-500">
              <Label htmlFor="email" className="text-base">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="lawyer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="pr-10 h-12 text-base transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-right-4 duration-500 delay-100">
              <Label htmlFor="password" className="text-base">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10 h-12 text-base transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-in fade-in duration-500 delay-200"
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>

            <div className="text-center pt-2 animate-in fade-in duration-500 delay-300">
              <p className="text-sm text-muted-foreground">
                ليس لديك حساب؟{" "}
                <Link
                  href="/signup"
                  className="text-secondary hover:text-secondary/80 font-semibold underline-offset-4 hover:underline transition-all duration-300"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
