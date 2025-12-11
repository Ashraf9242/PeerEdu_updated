import { Suspense } from "react"
import type { User } from "@prisma/client"

import { requireRole } from "@/auth-utils"
import { getTeacherDashboardData } from "./_actions/get-dashboard-data"
import { PendingRequests, PendingRequestsSkeleton } from "./_components/pending-requests"
import { UpcomingSessions, UpcomingSessionsSkeleton } from "./_components/upcoming-sessions"
import { SessionsChart, SessionsChartSkeleton } from "./_components/sessions-chart"
import { QuickActions } from "./_components/quick-actions"
import { TeacherHeroClient } from "./_components/teacher-hero-client"

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
  const displayName = teacher.name?.trim() || "teacher"

  return (
    <TeacherHeroClient
      teacherName={displayName}
      stats={{
        pendingCount: data.stats.pendingCount,
        confirmedCount: data.stats.confirmedCount,
        totalSessions: data.stats.totalSessions,
        ratingAvg: data.stats.ratingAvg,
        projectedEarnings: data.stats.projectedEarnings,
      }}
      subjectsCount={data.subjects.length}
    />
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
