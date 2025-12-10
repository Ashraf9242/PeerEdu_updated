import { Suspense } from "react"
import Link from "next/link"
import type { User } from "@prisma/client"

import { requireRole } from "@/auth-utils"
import { getTeacherDashboardData } from "./_actions/get-dashboard-data"
import {
  CalendarClock,
  CheckCircle,
  Clock,
  DollarSign,
  PenSquare,
  Sparkles,
  Star,
} from "lucide-react"
import { PendingRequests, PendingRequestsSkeleton } from "./_components/pending-requests"
import { UpcomingSessions, UpcomingSessionsSkeleton } from "./_components/upcoming-sessions"
import { SessionsChart, SessionsChartSkeleton } from "./_components/sessions-chart"
import { QuickActions } from "./_components/quick-actions"
import { Badge } from "@/components/ui/badge"

export default async function TeacherDashboardPage() {
  const teacher = await requireRole("TEACHER")

  return (
    <div className="space-y-8">
      <Suspense fallback={<TeacherHeroSkeleton />}>
        <TeacherHero teacher={teacher} />
      </Suspense>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
        <div className="space-y-8 xl:col-span-3">
          <Suspense fallback={<PendingRequestsSkeleton />}>
            <PendingRequests teacherId={teacher.id} />
          </Suspense>

          <Suspense fallback={<UpcomingSessionsSkeleton />}>
            <UpcomingSessions teacherId={teacher.id} />
          </Suspense>
        </div>
        <div className="space-y-8 xl:col-span-2">
          <QuickActions />

          <Suspense fallback={<SessionsChartSkeleton />}>
            <SessionsChart teacherId={teacher.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function TeacherHero({ teacher }: { teacher: Pick<User, "id" | "name"> }) {
  const data = await getTeacherDashboardData(teacher.id)
  const firstName = teacher.name?.split(" ")[0] || "teacher"
  const omrFormatter = new Intl.NumberFormat("en-OM", {
    style: "currency",
    currency: "OMR",
    minimumFractionDigits: 2,
  })

  const stats = [
    {
      label: "New Requests",
      value: data.stats.pendingCount,
      helper: "Awaiting reply",
      icon: Clock,
    },
    {
      label: "Upcoming Sessions",
      value: data.stats.confirmedCount,
      helper: "Next 7 days",
      icon: CalendarClock,
    },
    {
      label: "Total Sessions",
      value: data.stats.totalSessions,
      helper: "Completed",
      icon: CheckCircle,
    },
    {
      label: "My Subjects",
      value: data.subjects.length || "Pending",
      helper:
        data.subjects.length > 0
          ? "Approved subjects"
          : "Will appear after admin approval",
      icon: PenSquare,
    },
    {
      label: "Your Rating",
      value: data.stats.ratingAvg.toFixed(1),
      helper: "Out of 5",
      icon: Star,
    },
    {
      label: "Projected Earnings",
      value: omrFormatter.format(data.stats.projectedEarnings),
      helper: "OMR",
      icon: DollarSign,
    },
  ]

  return (
    <section className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary via-primary/90 to-slate-900 p-8 text-white shadow-xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Teacher dashboard
          </span>
          <h1 className="text-4xl font-semibold leading-tight">Welcome back, {firstName}.</h1>
          <p className="text-base text-white/85">
            Keep an eye on new requests, upcoming commitments, and your growth across PeerEdu.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur"
              >
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{stat.label}</span>
                  <stat.icon className="h-4 w-4 text-white/70" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.helper}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">Teaching spotlight</p>
              <p className="text-lg font-semibold text-white">Awaiting approval</p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              Pending
            </Badge>
          </div>
          <p className="mt-3 text-sm text-white/80">
            Subjects appear here once the admin team validates the grade reports you upload. Submit
            your transcripts under settings to unlock this section.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/dashboard/teacher/settings"
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow hover:bg-white/90"
            >
              Manage profile
            </Link>
            <Link
              href="/dashboard/teacher/settings#subjects"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Register subjects
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function TeacherHeroSkeleton() {
  return (
    <div className="rounded-3xl border border-muted bg-muted/30 p-8">
      <div className="h-6 w-40 animate-pulse rounded-full bg-muted-foreground/20" />
      <div className="mt-4 h-10 w-72 animate-pulse rounded-lg bg-muted-foreground/20" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`hero-skel-${index}`}
            className="h-24 animate-pulse rounded-2xl bg-muted-foreground/10"
          />
        ))}
      </div>
    </div>
  )
}
