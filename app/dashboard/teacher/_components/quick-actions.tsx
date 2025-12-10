
"use client"

import Link from "next/link"
import { BarChart2, Calendar, LayoutGrid, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

export function QuickActions() {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.teacher.quickActions")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/dashboard/teacher/settings">
            <Settings className="mr-2 h-4 w-4" />
            {t("dashboard.teacher.quickActions.settings")}
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/profile/teacher/availability">
            <Calendar className="mr-2 h-4 w-4" />
            {t("dashboard.teacher.quickActions.availability")}
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/dashboard/teacher/sessions">
            <LayoutGrid className="mr-2 h-4 w-4" />
            {t("dashboard.teacher.quickActions.sessions")}
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/dashboard/teacher/analytics">
            <BarChart2 className="mr-2 h-4 w-4" />
            {t("dashboard.teacher.quickActions.analytics")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
