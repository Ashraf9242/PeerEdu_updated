"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Phone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useLanguage } from "@/contexts/language-context"
import { UNIVERSITY_OPTIONS } from "@/lib/universities"

export default function RegisterPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">{t("register.title")}</h1>
              <p className="text-muted-foreground">{t("register.subtitle")}</p>
            </div>

            <Card className="p-6">
              <CardContent className="space-y-4 p-0">
                <RegisterForm />
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("register.signin").split("?")[0]}?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  {t("register.signin").includes("Sign in here") ? "Sign in here" : "سجل دخولك هنا"}
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

function RegisterForm() {
  const { t } = useLanguage()
  const router = useRouter()

  const universityOptions = [...UNIVERSITY_OPTIONS]
    .map((option) => ({
      value: option.value,
      label: t(option.labelKey),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    role: "student",
    firstName: "",
    middleName: "",
    familyName: "",
    phone: "+968",
    email: "",
    university: "",
    yearOfStudy: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  type RequiredFieldKey =
    | "firstName"
    | "familyName"
    | "phone"
    | "email"
    | "university"
    | "yearOfStudy"
    | "password"
    | "confirmPassword"

  const validateForm = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const rules: Array<{
      key: RequiredFieldKey
      message: string
      isValid?: (value: string) => boolean
    }> = [
      { key: "firstName", message: "Please enter your first name." },
      { key: "familyName", message: "Please enter your family name." },
      {
        key: "phone",
        message: "Please enter a valid phone number.",
        isValid: (value) => value.replace(/\D/g, "").length >= 6,
      },
      {
        key: "email",
        message: "Please enter a valid email address.",
        isValid: (value) => emailPattern.test(value),
      },
      { key: "university", message: "Please select your university." },
      { key: "yearOfStudy", message: "Please select your year of study." },
      {
        key: "password",
        message: "Please create a password with at least 8 characters.",
        isValid: (value) => value.length >= 8,
      },
      {
        key: "confirmPassword",
        message: "Please confirm your password.",
      },
    ]

    for (const rule of rules) {
      const rawValue = formData[rule.key]
      const value = typeof rawValue === "string" ? rawValue.trim() : ""
      const isValid = rule.isValid ? rule.isValid(value) : Boolean(value)

      if (!isValid) {
        toast.error(rule.message)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      toast.error("Please accept the terms and privacy policy to continue.")
      return
    }

    if (!validateForm()) {
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = new FormData()
      payload.append("role", formData.role)
      payload.append("firstName", formData.firstName)
      payload.append("middleName", formData.middleName)
      payload.append("familyName", formData.familyName)
      payload.append("phone", formData.phone)
      payload.append("email", formData.email)
      payload.append("university", formData.university)
      payload.append("yearOfStudy", formData.yearOfStudy)
      payload.append("password", formData.password)
      payload.append("confirmPassword", formData.confirmPassword)
      payload.append("agreeToTerms", String(formData.agreeToTerms))

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: payload,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        toast.error(result?.error || "Failed to create your account.")
        return
      }

      toast.success(result.message || "Account created successfully.")
      router.push("/login?registered=1")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Unable to create your account right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const containerClass =
    formData.role === "student"
      ? "rounded-xl p-6 bg-card/60 border border-border/60 shadow-sm backdrop-blur-sm"
      : "rounded-xl p-6 bg-accent text-accent-foreground border border-accent/40 shadow-sm"

  return (
    <div className={containerClass}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Role Switch */}
      <div className="space-y-2">
        <Label htmlFor="role">{t("register.role.title")}</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            className={formData.role === "student" ? "bg-white/80 text-foreground hover:bg-white" : "bg-muted text-foreground"}
            variant={formData.role === "student" ? "default" : "secondary"}
            onClick={() => handleInputChange("role", "student")}
          >
            {t("register.role.student")}
          </Button>
          <Button
            type="button"
            className={formData.role === "teacher" ? "bg-foreground text-background hover:bg-foreground/90" : "bg-muted text-foreground"}
            variant={formData.role === "teacher" ? "default" : "secondary"}
            onClick={() => handleInputChange("role", "teacher")}
          >
            {t("register.role.teacher")}
          </Button>
        </div>
      </div>
      {/* Name Fields */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("register.firstName")}</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              type="text"
              placeholder={t("register.placeholder.firstName")}
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="pl-10 bg-background"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="middleName">{t("register.middleName")}</Label>
          <Input
            id="middleName"
            type="text"
            placeholder={t("register.placeholder.middleName")}
            value={formData.middleName}
            onChange={(e) => handleInputChange("middleName", e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="familyName">{t("register.familyName")}</Label>
          <Input
            id="familyName"
            type="text"
            placeholder={t("register.placeholder.familyName")}
            value={formData.familyName}
            onChange={(e) => handleInputChange("familyName", e.target.value)}
            className="bg-background"
            required
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone">{t("register.phone")}</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder={t("register.placeholder.phone")}
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="pl-10 bg-background"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">{t("register.email")}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t("register.placeholder.email")}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="pl-10 bg-background"
            required
          />
        </div>
      </div>

      {/* University Selection */}
      <div className="space-y-2">
        <Label htmlFor="university">{t("register.university")}</Label>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Select value={formData.university || undefined} onValueChange={(value) => handleInputChange("university", value)}>
            <SelectTrigger className="pl-10 bg-background">
              <SelectValue placeholder={t("register.placeholder.university")} />
            </SelectTrigger>
            <SelectContent>
              {universityOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Year of Study */}
      <div className="space-y-2">
        <Label htmlFor="yearOfStudy">{t("register.yearOfStudy")}</Label>
        <Select value={formData.yearOfStudy || undefined} onValueChange={(value) => handleInputChange("yearOfStudy", value)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder={t("register.placeholder.yearOfStudy")} />
          </SelectTrigger>
                     <SelectContent>
             <SelectItem value="foundation1">{t("register.year.foundation1")}</SelectItem>
             <SelectItem value="foundation2">{t("register.year.foundation2")}</SelectItem>
             <SelectItem value="foundation3">{t("register.year.foundation3")}</SelectItem>
             <SelectItem value="foundation4">{t("register.year.foundation4")}</SelectItem>
             <SelectItem value="study1">{t("register.year.study1")}</SelectItem>
             <SelectItem value="study2">{t("register.year.study2")}</SelectItem>
             <SelectItem value="study3">{t("register.year.study3")}</SelectItem>
             <SelectItem value="study4">{t("register.year.study4")}</SelectItem>
             <SelectItem value="graduate">{t("register.year.graduate")}</SelectItem>
           </SelectContent>
        </Select>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">{t("register.password")}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("register.placeholder.password")}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="pl-10 pr-10 bg-background"
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

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("register.placeholder.confirmPassword")}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="pl-10 pr-10 bg-background"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm">
          {t("register.terms")}
        </Label>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" size="lg" disabled={!formData.agreeToTerms || isSubmitting}>
        {isSubmitting ? t("register.loading") : t("register.submit")}
      </Button>
    </form>
    </div>
  )
}
