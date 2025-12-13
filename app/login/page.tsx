"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useLanguage } from "@/contexts/language-context"

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
            
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">{t("login.title")}</h1>
              <p className="text-muted-foreground">{t("login.subtitle")}</p>
            </div>

            <Card className="p-6">
              <CardContent className="space-y-4 p-0">
                <Suspense fallback={<div className="py-4 text-center text-sm text-muted-foreground">{t("login.loading")}</div>}>
                  <LoginForm />
                </Suspense>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("login.signup").split("?")[0]}?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  {t("login.signup").includes("Sign up here") ? "Sign up here" : "أنشئ حساباً هنا"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      toast.success("Account created successfully. Please log in.")
    }
  }, [searchParams])

  const getDashboardRoute = (role?: string | null) => {
    switch (role) {
      case "TEACHER":
        return "/dashboard/teacher"
      case "ADMIN":
        return "/dashboard/admin"
      default:
        return "/dashboard/student"
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const callbackUrl = searchParams.get("callbackUrl") ?? undefined
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (!result || result.error) {
        toast.error("Invalid email or password. Please try again.")
        return
      }

      let destination = callbackUrl
      if (!destination) {
        const sessionResponse = await fetch("/api/auth/session")
        const session = sessionResponse.ok ? await sessionResponse.json() : null
        destination = getDashboardRoute(session?.user?.role)
      }

      router.push(destination || "/dashboard/student")
      router.refresh()
      toast.success("Logged in successfully.")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Unable to sign in right now. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("login.email")}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t("login.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("login.password")}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("login.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="remember" className="rounded border-gray-300" />
          <Label htmlFor="remember" className="text-sm">
            {t("login.remember")}
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
          {t("login.forgot")}
        </Link>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? t("login.loading") : t("login.submit")}
      </Button>
    </form>
  )
}
