
import { requireRole } from "@/auth-utils";
import { Suspense } from "react";
import { DashboardHeader } from "../_components/dashboard-header";
import { StatCard, StatCardSkeleton } from "../student/_components/stat-card"; // Reusing from student dashboard
import { getTeacherDashboardData } from "./_actions/get-dashboard-data";
import { Clock, CheckCircle, Users, Star, DollarSign } from "lucide-react";
import { PendingRequests, PendingRequestsSkeleton } from "./_components/pending-requests";
import { UpcomingSessions, UpcomingSessionsSkeleton } from "./_components/upcoming-sessions";
import { SessionsChart, SessionsChartSkeleton } from "./_components/sessions-chart";
import { QuickActions } from "./_components/quick-actions";

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
