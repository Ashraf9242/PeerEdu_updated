
import { requireRole } from "@/auth-utils";
import { Suspense } from "react";
import { DashboardHeader } from "../_components/dashboard-header";
import { StatCard, StatCardSkeleton } from "./_components/stat-card";
import { getStudentDashboardData } from "./_actions/get-dashboard-data";
import { UpcomingSessions, UpcomingSessionsSkeleton } from "./_components/upcoming-sessions";
import { QuickActions } from "./_components/quick-actions";
import { RecentReviews, RecentReviewsSkeleton } from "./_components/recent-reviews";
import { Book, CheckCircle, Clock, Star } from "lucide-react";

export default async function StudentDashboardPage() {
  const student = await requireRole("STUDENT");

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Student Dashboard"
        subtitle={`Welcome back, ${student.name}!`}
      />

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsGrid studentId={student.id} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Upcoming and Pending Sessions */}
            <Suspense fallback={<UpcomingSessionsSkeleton />}>
                <UpcomingSessions studentId={student.id} />
            </Suspense>
        </div>
        <div className="lg:col-span-1 space-y-8">
            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Reviews / Rate Sessions */}
            <Suspense fallback={<RecentReviewsSkeleton />}>
                <RecentReviews studentId={student.id} />
            </Suspense>
        </div>
      </div>
    </div>
  );
}

async function StatsGrid({ studentId }: { studentId: string }) {
    const data = await getStudentDashboardData(studentId);
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Upcoming Sessions" value={data.stats.upcomingCount} icon={Clock} />
            <StatCard title="Completed Sessions" value={data.stats.completedCount} icon={CheckCircle} />
            <StatCard title="Total Hours" value={data.stats.totalHours} icon={Book} />
            <StatCard title="Favorite Tutors" value={data.stats.favoriteTutorsCount} icon={Star} />
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
        </div>
    );
}
