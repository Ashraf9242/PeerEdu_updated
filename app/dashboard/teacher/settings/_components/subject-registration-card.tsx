"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
  const gradeProofInputRef = useRef<HTMLInputElement | null>(null)
  const [formState, setFormState] = useState<Subject>({
    name: "",
    code: "",
    college: "",
    grade: "",
  })
  const [gradeProof, setGradeProof] = useState<File | null>(null)
  const [gradeProofName, setGradeProofName] = useState<string | null>(null)
  const [verificationChecks, setVerificationChecks] = useState({
    identityConfirmed: false,
    gradeConfirmed: false,
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

  const handleGradeProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setGradeProof(file)
    setGradeProofName(file ? file.name : null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.college) {
      toast.error(t("register.placeholder.university"))
      return
    }
    if (!gradeProof) {
      toast.error(t("dashboard.teacher.gradeProof.error"))
      return
    }
    if (!verificationChecks.identityConfirmed || !verificationChecks.gradeConfirmed) {
      toast.error(t("dashboard.teacher.subjectVerification.error"))
      return
    }
    setIsSaving(true)

    setTimeout(() => {
      setSubjects((prev) => [...prev, formState])
      setFormState({ name: "", code: "", college: "", grade: "" })
      setGradeProof(null)
      setGradeProofName(null)
      if (gradeProofInputRef.current) {
        gradeProofInputRef.current.value = ""
      }
      setVerificationChecks({ identityConfirmed: false, gradeConfirmed: false })
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
            <Label htmlFor="grade-proof">
              {t("dashboard.teacher.gradeProof")} <span className="text-primary">*</span>
            </Label>
            <Input
              ref={gradeProofInputRef}
              id="grade-proof"
              type="file"
              accept="application/pdf,image/*"
              onChange={handleGradeProofUpload}
            />
            <p className="text-xs text-muted-foreground">
              {t("dashboard.teacher.gradeProof.helper")}
            </p>
            {gradeProofName && (
              <p className="text-xs text-primary">
                {t("dashboard.teacher.gradeProof.selected")}: {gradeProofName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("dashboard.teacher.availabilityTitle")}</Label>
            <p className="text-sm text-muted-foreground">{t("dashboard.teacher.availabilityHelper")}</p>
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
                        {subject.code} | {subject.grade} |{" "}
                        {universityLabelMap[subject.college] || subject.college}
                      </p>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="identityConfirmed"
                checked={verificationChecks.identityConfirmed}
                onCheckedChange={(checked) =>
                  setVerificationChecks((prev) => ({ ...prev, identityConfirmed: Boolean(checked) }))
                }
              />
              <Label htmlFor="identityConfirmed" className="text-sm leading-tight">
                {t("dashboard.teacher.subjectVerification.identity")}
              </Label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="gradeConfirmed"
                checked={verificationChecks.gradeConfirmed}
                onCheckedChange={(checked) =>
                  setVerificationChecks((prev) => ({ ...prev, gradeConfirmed: Boolean(checked) }))
                }
              />
              <Label htmlFor="gradeConfirmed" className="text-sm leading-tight">
                {t("dashboard.teacher.subjectVerification.grade")}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.teacher.subjectVerification.helper")}
            </p>
          </div>
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
