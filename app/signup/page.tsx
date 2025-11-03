"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthBackground } from "@/components/auth-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Mail, Lock, User, AlertCircle, Eye, EyeOff, Key } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const REGISTRATION_CODE = "amr7ajabdal"

export default function SignupPage() {
  const [registrationCode, setRegistrationCode] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signup, user } = useAuth()
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

    if (registrationCode !== REGISTRATION_CODE) {
      setError("رمز التسجيل غير صحيح. يرجى التواصل مع الإدارة للحصول على رمز التسجيل.")
      setIsLoading(false)
      return
    }

    if (!name || !email || !password || !confirmPassword) {
      setError("يرجى ملء جميع الحقول")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح (مثال: name@gmail.com)")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      setIsLoading(false)
      return
    }

    const success = await signup(name, email, password)

    if (!success) {
      setError("البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.")
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
            إنشاء حساب جديد
          </CardTitle>
          <CardDescription className="text-base animate-in fade-in duration-700 delay-100">
            انضم إلى نظام إدارة المواعيد القانونية
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2 animate-in slide-in-from-right-4 duration-500">
              <Label htmlFor="registrationCode" className="text-base flex items-center gap-2">
                <Key className="w-4 h-4" />
                رمز التسجيل
              </Label>
              <div className="relative">
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                <Input
                  id="registrationCode"
                  type="text"
                  placeholder="أدخل رمز التسجيل الخاص"
                  value={registrationCode}
                  onChange={(e) => setRegistrationCode(e.target.value.trim())}
                  className="pr-10 h-11 text-base transition-all duration-300 focus:scale-[1.02] font-mono"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">يرجى إدخال رمز التسجيل الذي حصلت عليه من الإدارة</p>
            </div>

            <div className="space-y-2 animate-in slide-in-from-right-4 duration-500 delay-75">
              <Label htmlFor="name" className="text-base">
                الاسم الكامل
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="أحمد محمد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pr-10 h-11 text-base transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-right-4 duration-500 delay-150">
              <Label htmlFor="email" className="text-base">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="lawyer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="pr-10 h-11 text-base transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-right-4 duration-500 delay-200">
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
                  className="pr-10 pl-10 h-11 text-base transition-all duration-300 focus:scale-[1.02]"
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

            <div className="space-y-2 animate-in slide-in-from-right-4 duration-500 delay-250">
              <Label htmlFor="confirmPassword" className="text-base">
                تأكيد كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 pl-10 h-11 text-base transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-in fade-in duration-500 delay-300"
              disabled={isLoading}
            >
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </Button>

            <div className="text-center pt-2 animate-in fade-in duration-500 delay-400">
              <p className="text-sm text-muted-foreground">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/"
                  className="text-secondary hover:text-secondary/80 font-semibold underline-offset-4 hover:underline transition-all duration-300"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
