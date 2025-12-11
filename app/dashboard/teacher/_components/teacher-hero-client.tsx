"use client"

import Link from "next/link"
import {
  CalendarClock,
  CheckCircle,
  Clock,
  DollarSign,
  PenSquare,
  Sparkles,
  Star,
} from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import { Badge } from "@/components/ui/badge"

type TeacherHeroClientProps = {
  teacherName: string
  stats: {
    pendingCount: number
    confirmedCount: number
    totalSessions: number
    ratingAvg: number
    projectedEarnings: number
  }
  subjectsCount: number
}

export function TeacherHeroClient({ teacherName, stats, subjectsCount }: TeacherHeroClientProps) {
  const { t, language } = useLanguage()

  const omrFormatter = new Intl.NumberFormat(language === "ar" ? "ar-OM" : "en-OM", {
    style: "currency",
    currency: "OMR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const ratingValue = Number.isFinite(stats.ratingAvg) ? Number(stats.ratingAvg) : 0

  const statsCopy = [
    {
      label: t("dashboard.teacher.stats.requests"),
      value: stats.pendingCount,
      helper: t("dashboard.teacher.stats.requestsHelper"),
      icon: Clock,
    },
    {
      label: t("dashboard.teacher.stats.upcoming"),
      value: stats.confirmedCount,
      helper: t("dashboard.teacher.stats.upcomingHelper"),
      icon: CalendarClock,
    },
    {
      label: t("dashboard.teacher.stats.total"),
      value: stats.totalSessions,
      helper: t("dashboard.teacher.stats.totalHelper"),
      icon: CheckCircle,
    },
    {
      label: t("dashboard.teacher.stats.subjects"),
      value: subjectsCount > 0 ? subjectsCount : t("dashboard.teacher.stats.pendingValue"),
      helper: t(
        subjectsCount > 0
          ? "dashboard.teacher.stats.subjectsApproved"
          : "dashboard.teacher.stats.subjectsPending",
      ),
      icon: PenSquare,
    },
    {
      label: t("dashboard.teacher.stats.rating"),
      value: ratingValue.toFixed(1),
      helper: t("dashboard.teacher.stats.ratingHelper"),
      icon: Star,
    },
    {
      label: t("dashboard.teacher.stats.earnings"),
      value: omrFormatter.format(stats.projectedEarnings),
      helper: t("dashboard.teacher.stats.earningsHelper"),
      icon: DollarSign,
    },
  ]

  const welcomeText = t("dashboard.teacher.hero.welcome").replace("{{name}}", teacherName)

  return (
    <section className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary via-primary/90 to-slate-900 p-8 text-white shadow-xl">
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            {t("dashboard.teacher.hero.badge")}
          </span>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold leading-tight">{welcomeText}</h1>
              <p className="text-base text-white/85">{t("dashboard.teacher.hero.subtitle")}</p>
            </div>
            <Link
              href="/dashboard/teacher/settings#subjects"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t("dashboard.teacher.hero.registerCta")}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statsCopy.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur"
              >
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{stat.label}</span>
                  <stat.icon className="h-4 w-4 text-white/70" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.helper}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wide text-white/70">
                {t("dashboard.teacher.hero.spotlightTitle")}
              </p>
              <p className="text-2xl font-semibold text-white">
                {t("dashboard.teacher.hero.spotlightStatus")}
              </p>
              <p className="text-sm text-white/80">
                {t("dashboard.teacher.hero.spotlightDescription")}
              </p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              {t("dashboard.teacher.hero.pendingBadge")}
            </Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/dashboard/teacher/settings"
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow hover:bg-white/90"
            >
              {t("dashboard.teacher.hero.manageProfile")}
            </Link>
            <Link
              href="/dashboard/teacher/settings#subjects"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t("dashboard.teacher.hero.registerSubjects")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
