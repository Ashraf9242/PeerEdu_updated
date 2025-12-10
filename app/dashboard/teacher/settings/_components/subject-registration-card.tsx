"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { AvailabilityManager } from "@/components/availability-manager"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UNIVERSITY_OPTIONS } from "@/lib/universities"

type Subject = {
  name: string
  code: string
  college: string
  grade: string
}

export function SubjectRegistrationCard() {
  const { t } = useLanguage()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [formState, setFormState] = useState<Subject>({
    name: "",
    code: "",
    college: "",
    grade: "",
  })

  const universityOptions = UNIVERSITY_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  })).sort((a, b) => a.label.localeCompare(b.label))
  const universityLabelMap = universityOptions.reduce<Record<string, string>>(
    (acc, option) => {
      acc[option.value] = option.label
      return acc
    },
    {},
  )

  const handleChange = (field: keyof Subject, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.college) {
      toast.error(t("register.placeholder.university"))
      return
    }
    setIsSaving(true)

    setTimeout(() => {
      setSubjects((prev) => [...prev, formState])
      setFormState({ name: "", code: "", college: "", grade: "" })
      setIsSaving(false)
      toast.success(t("dashboard.teacher.subjectAdded"))
    }, 500)
  }

  return (
    <Card className="lg:col-span-3" id="subjects">
      <CardHeader>
        <CardTitle>{t("dashboard.teacher.subjectFormTitle")}</CardTitle>
        <CardDescription className="space-y-1">
          <span>{t("dashboard.teacher.subjectFormSubtitle")}</span>
          <span className="block text-xs text-muted-foreground">
            {t("dashboard.teacher.subjectApprovalNote")}
          </span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject-name">
                {t("dashboard.teacher.subjectName")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="subject-name"
                required
                value={formState.name}
                onChange={(event) => handleChange("name", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-code">
                {t("dashboard.teacher.subjectCode")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="subject-code"
                required
                value={formState.code}
                onChange={(event) => handleChange("code", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="college">
                {t("dashboard.teacher.college")} <span className="text-primary">*</span>
              </Label>
              <Select
                value={formState.college}
                onValueChange={(value) => handleChange("college", value)}
              >
                <SelectTrigger id="college">
                  <SelectValue placeholder={t("register.placeholder.university")} />
                </SelectTrigger>
                <SelectContent>
                  {universityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">
                {t("dashboard.teacher.grade")} <span className="text-primary">*</span>
              </Label>
              <Input
                id="grade"
                required
                value={formState.grade}
                onChange={(event) => handleChange("grade", event.target.value)}
                placeholder="A+"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Weekly availability</Label>
            <p className="text-sm text-muted-foreground">
              Set the time slots students can book with you.
            </p>
            <AvailabilityManager
              tutorId="teacher-planning"
              initialAvailabilities={[]}
              showHeading={false}
              layout="compact"
              className="space-y-4"
            />
          </div>

          {subjects.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">{t("dashboard.teacher.subjectListTitle")}</p>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Badge key={`${subject.code}-${subject.name}`} variant="secondary" className="px-3 py-1">
                    <div className="text-left">
                      <p className="font-semibold text-xs">{subject.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {subject.code} • {subject.grade} •{" "}
                        {universityLabelMap[subject.college] || subject.college}
                      </p>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? t("dashboard.teacher.saving") : t("dashboard.teacher.subjectSubmit")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
