import { Suspense } from "react"

import { requireRole } from "@/auth-utils"
import { DashboardHeader } from "../../_components/dashboard-header"
import { UpcomingSessions, UpcomingSessionsSkeleton } from "../_components/upcoming-sessions"
import { SessionsChart, SessionsChartSkeleton } from "../_components/sessions-chart"

export default async function TeacherSessionsPage() {
  const teacher = await requireRole("TEACHER")

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Sessions overview"
        subtitle="Track current bookings and review performance trends."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Suspense fallback={<UpcomingSessionsSkeleton />}>
            <UpcomingSessions teacherId={teacher.id} />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<SessionsChartSkeleton />}>
            <SessionsChart teacherId={teacher.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
