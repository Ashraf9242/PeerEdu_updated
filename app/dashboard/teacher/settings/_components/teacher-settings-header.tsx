"use client"

import { DashboardHeader } from "@/app/dashboard/_components/dashboard-header"
import { useLanguage } from "@/contexts/language-context"

export function TeacherSettingsHeader() {
  const { t } = useLanguage()

  return (
    <DashboardHeader
      title={t("dashboard.teacher.settings.title")}
      subtitle={t("dashboard.teacher.settings.subtitle")}
    />
  )
}
