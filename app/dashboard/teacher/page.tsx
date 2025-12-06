
import { requireRole } from "@/auth-utils"
import Link from "next/link"
import { Suspense } from "react"
import { DashboardHeader } from "../_components/dashboard-header"
import { StatCard, StatCardSkeleton } from "../student/_components/stat-card" // Reusing from student dashboard
import { getTeacherDashboardData } from "./_actions/get-dashboard-data"
import { Clock, CheckCircle, Users, Star, DollarSign, Sparkles } from "lucide-react"
import { PendingRequests, PendingRequestsSkeleton } from "./_components/pending-requests"
import { UpcomingSessions, UpcomingSessionsSkeleton } from "./_components/upcoming-sessions"
import { SessionsChart, SessionsChartSkeleton } from "./_components/sessions-chart"
import { QuickActions } from "./_components/quick-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function TeacherDashboardPage() {
  const teacher = await requireRole("TEACHER");

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Teacher Dashboard"
        subtitle={`Here's what's happening, ${teacher.name}.`}
      />

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsGrid teacherId={teacher.id} />
      </Suspense>

      <TeachingSpotlight />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3 space-y-8">
            {/* Pending Requests */}
            <Suspense fallback={<PendingRequestsSkeleton />}>
                <PendingRequests teacherId={teacher.id} />
            </Suspense>

            {/* Upcoming Sessions */}
            <Suspense fallback={<UpcomingSessionsSkeleton />}>
                <UpcomingSessions teacherId={teacher.id} />
            </Suspense>
        </div>
        <div className="xl:col-span-2 space-y-8">
            {/* Quick Actions */}
            <QuickActions />

            {/* Sessions Chart */}
            <Suspense fallback={<SessionsChartSkeleton />}>
                <SessionsChart teacherId={teacher.id} />
            </Suspense>
        </div>
      </div>
    </div>
  );
}

async function StatsGrid({ teacherId }: { teacherId: string }) {
    const data = await getTeacherDashboardData(teacherId);
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard title="New Requests" value={data.stats.pendingCount} icon={Clock} />
            <StatCard title="Upcoming Sessions" value={data.stats.confirmedCount} icon={Users} />
            <StatCard title="Total Sessions" value={data.stats.totalSessions} icon={CheckCircle} />
            <StatCard title="Your Rating" value={`${data.stats.ratingAvg.toFixed(1)} ⭐`} icon={Star} />
            <StatCard title="Projected Earnings" value={`$${data.stats.projectedEarnings.toFixed(2)}`} icon={DollarSign} />
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
        </div>
    );
}

function TeachingSpotlight() {
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-background to-background border-primary/20">
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/20 p-3 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Teaching spotlight</CardTitle>
            <CardDescription>
              Highlight your signature subjects and share the grades that prove your expertise.
            </CardDescription>
          </div>
        </div>
        <Link
          href="/dashboard/teacher/settings"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Update profile
        </Link>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          Calculus IV • A+
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          Physics Lab • Distinction
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          Research Methodology • Certified
        </Badge>
      </CardContent>
    </Card>
  )
}
