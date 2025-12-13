"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

type AdminStat = {
  labelKey: string
  value: string
  helperText?: string | null
}

type QuickAction = {
  labelKey: string
  href: string
  badgeContent?: string | number | null
}

interface AdminHeroProps {
  stats: AdminStat[]
  quickActions: QuickAction[]
}

export function AdminHero({ stats, quickActions }: AdminHeroProps) {
  const { t } = useLanguage()

  return (
    <section className="space-y-8 rounded-3xl border border-border bg-background px-6 py-8 shadow-sm">
      <div className="space-y-3">
        <Badge variant="outline" className="px-3 py-1 text-xs font-semibold tracking-wide">
          {t("admin.dashboard.title")}
        </Badge>
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            {t("admin.dashboard.subtitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("admin.stats.userGrowth")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.labelKey}
            className="rounded-2xl border border-border bg-muted/30 p-4 transition hover:bg-muted/50"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {t(stat.labelKey)}
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {stat.value}
            </p>
            {stat.helperText && (
              <p className="mt-1 text-xs text-muted-foreground">{stat.helperText}</p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("admin.quickActions.title")}
        </p>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              variant="outline"
              size="sm"
              className="gap-2"
              asChild
            >
              <Link href={action.href}>
                {t(action.labelKey)}
                {action.badgeContent !== undefined && action.badgeContent !== null && (
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {action.badgeContent}
                  </Badge>
                )}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
