"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

type TeacherProfileSettingsProps = {
  teacher: {
    firstName: string | null
    middleName: string | null
    familyName: string | null
    email: string
    phone: string | null
  }
}

export function TeacherProfileSettingsCard({ teacher }: TeacherProfileSettingsProps) {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState(false)
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    prefix: "Dr.",
    firstName: teacher.firstName ?? "",
    middleName: teacher.middleName ?? "",
    familyName: teacher.familyName ?? "",
    phone: teacher.phone ?? "",
    email: teacher.email,
    bio: "",
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success(t("dashboard.teacher.profileUpdated"))
    }, 600)
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>{t("dashboard.teacher.profileSettings")}</CardTitle>
        <CardDescription>{t("dashboard.teacher.profileSubtitle")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="prefix">
                {t("dashboard.teacher.prefix")} <span className="text-primary">*</span>
              </Label>
              <Select
                value={formState.prefix}
                onValueChange={(value) => handleChange("prefix", value)}
              >
                <SelectTrigger id="prefix">
                  <SelectValue placeholder={t("dashboard.teacher.prefixPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t("dashboard.teacher.firstName")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="firstName"
                required
                value={formState.firstName}
                onChange={(event) => handleChange("firstName", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyName">
                {t("dashboard.teacher.familyName")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="familyName"
                required
                value={formState.familyName}
                onChange={(event) => handleChange("familyName", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="middleName">{t("dashboard.teacher.middleName")}</Label>
              <Input
                id="middleName"
                value={formState.middleName}
                onChange={(event) => handleChange("middleName", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("dashboard.teacher.email")}</Label>
              <Input id="email" type="email" value={formState.email} readOnly disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              {t("dashboard.teacher.phone")} <span className="text-primary">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formState.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t("dashboard.teacher.bio")}</Label>
            <Textarea
              id="bio"
              rows={4}
              value={formState.bio}
              onChange={(event) => handleChange("bio", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">{t("dashboard.teacher.photoLabel")}</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0]
                setPhotoName(file ? file.name : null)
              }}
            />
            {photoName && (
              <p className="text-sm text-muted-foreground">
                {t("dashboard.teacher.photoSelected")}: {photoName}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? t("dashboard.teacher.saving") : t("dashboard.teacher.updateProfile")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
