"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

export function TeachingPreferencesCard() {
  const { t } = useLanguage()

  const points = [
    t("dashboard.teacher.preferences.point1"),
    t("dashboard.teacher.preferences.point2"),
    t("dashboard.teacher.preferences.point3"),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.teacher.preferences.title")}</CardTitle>
        <CardDescription>{t("dashboard.teacher.preferences.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <ul className="list-disc space-y-2 pl-5">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
