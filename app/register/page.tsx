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
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Phone, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"

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

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Registration attempt:", formData)
    console.log("Selected file:", selectedFile)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const containerClass =
    formData.role === "student"
      ? "rounded-xl p-6 bg-card/60 border border-border/60 shadow-sm backdrop-blur-sm"
      : "rounded-xl p-6 bg-accent text-accent-foreground border border-accent/40 shadow-sm"

  return (
    <div className={containerClass}>
    <form onSubmit={handleSubmit} className="space-y-4">
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
            required
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
          <Select onValueChange={(value) => handleInputChange("university", value)}>
            <SelectTrigger className="pl-10 bg-background">
              <SelectValue placeholder={t("register.placeholder.university")} />
            </SelectTrigger>
            <SelectContent>
              {[
                { value: "squ", label: t("register.university.squ") },
                { value: "dhofar-university", label: t("register.university.dhofar") },
                { value: "german-university", label: t("register.university.german") },
                { value: "muscat-university", label: t("register.university.muscat") },
                { value: "nizwa-university", label: t("register.university.nizwa") },
                { value: "oman-university", label: t("register.university.oman") },
                { value: "utas-ibri", label: t("register.university.utas.ibri") },
                { value: "utas-muscat", label: t("register.university.utas.muscat") },
                { value: "utas-nizwa", label: t("register.university.utas.nizwa") },
                { value: "utas-salalah", label: t("register.university.utas.salalah") },
                { value: "utas-sohar", label: t("register.university.utas.sohar") },
              ]
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Year of Study */}
      <div className="space-y-2">
        <Label htmlFor="yearOfStudy">{t("register.yearOfStudy")}</Label>
        <Select onValueChange={(value) => handleInputChange("yearOfStudy", value)}>
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

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="uploadId">{t("register.uploadId")}</Label>
        <div className="relative">
          <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="uploadId"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
            className="pl-10 bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            required
          />
        </div>
        {selectedFile && (
          <p className="text-sm text-muted-foreground">
            Selected: {selectedFile.name}
          </p>
        )}
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
      <Button type="submit" className="w-full" size="lg" disabled={!formData.agreeToTerms}>
        {t("register.submit")}
      </Button>

      
    </form>
    </div>
  )
}
