"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"

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
import { cn } from "@/lib/utils"
import { updateTeacherProfile } from "../_actions/update-teacher-profile"

type TeacherProfileSettingsProps = {
  teacher: {
    prefix?: string | null
    firstName: string | null
    middleName: string | null
    familyName: string | null
    email: string
    phone: string | null
    bio?: string | null
  }
}

export function TeacherProfileSettingsCard({ teacher }: TeacherProfileSettingsProps) {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState(false)
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [formState, setFormState] = useState({
    prefix: teacher.prefix ?? "Mr.",
    firstName: teacher.firstName ?? "",
    middleName: teacher.middleName ?? "",
    familyName: teacher.familyName ?? "",
    phone: teacher.phone ?? "",
    email: teacher.email,
    bio: teacher.bio ?? "",
  })

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setPhotoName(null)
      setPhotoPreview(null)
      return
    }
    setPhotoName(file.name)
    const objectUrl = URL.createObjectURL(file)
    setPhotoPreview(objectUrl)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      await updateTeacherProfile({
        prefix: formState.prefix,
        firstName: formState.firstName.trim(),
        middleName: formState.middleName?.trim() || "",
        familyName: formState.familyName.trim(),
        phone: formState.phone.trim(),
        bio: formState.bio.trim(),
      })
      toast.success(t("dashboard.teacher.profileUpdated"))
    } catch (error) {
      console.error("Failed to update teacher profile:", error)
      toast.error(t("dashboard.teacher.profileUpdateError"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>{t("dashboard.teacher.profileSettings")}</CardTitle>
        <CardDescription>{t("dashboard.teacher.profileSubtitle")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 sm:flex-row sm:items-center">
            <div className="flex flex-col items-center gap-3">
              <div className={cn("relative h-24 w-24 overflow-hidden rounded-full bg-white/40 shadow-inner", photoPreview && "ring-4 ring-primary/40")}>
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt={t("dashboard.teacher.photoAlt")}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-primary">
                    {formState.firstName?.[0] || "T"}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  {photoPreview ? t("dashboard.teacher.photoReplace") : t("dashboard.teacher.photoUpload")}
                </Button>
                {photoPreview && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => {
                    setPhotoName(null)
                    setPhotoPreview(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}>
                    {t("dashboard.teacher.photoRemove")}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-2 text-sm text-muted-foreground">
              <p>{t("dashboard.teacher.photoHelper")}</p>
              {photoName && (
                <p className="text-xs text-primary">
                  {t("dashboard.teacher.photoSelected")}: {photoName}
                </p>
              )}
            </div>
            <Input
              ref={fileInputRef}
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

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
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
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

          <div className="grid gap-4 sm:grid-cols-2">
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
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? t("dashboard.teacher.saving") : t("dashboard.teacher.updateProfile")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
