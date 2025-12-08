import { Suspense } from "react";

import { requireRole } from "@/auth-utils";
import { getStudentDashboardData } from "./_actions/get-dashboard-data";
import {
  UpcomingSessions,
  UpcomingSessionsSkeleton,
} from "./_components/upcoming-sessions";
import { QuickActions } from "./_components/quick-actions";
import {
  RecentReviews,
  RecentReviewsSkeleton,
} from "./_components/recent-reviews";
import type { BookingWithTutor } from "./_components/upcoming-sessions-client";
import { StudentHeroSection } from "./_components/student-hero";
import { StatsGrid } from "./_components/stats-grid";

export default async function StudentDashboardPage() {
  const student = await requireRole("STUDENT");
  const dashboardData = await getStudentDashboardData(student.id);
  const nextSession = getNextSession(dashboardData.upcomingSessions);
  const pendingCount = dashboardData.pendingRequests.length;

  return (
    <div className="space-y-8">
      <StudentHeroSection
        studentName={student.name}
        stats={dashboardData.stats}
        nextSession={nextSession}
        pendingCount={pendingCount}
      />

      <StatsGrid stats={dashboardData.stats} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3" id="sessions">
        <div className="space-y-8 lg:col-span-2">
          <Suspense fallback={<UpcomingSessionsSkeleton />}>
            <UpcomingSessions
              studentId={student.id}
              initialData={{
                upcomingSessions: dashboardData.upcomingSessions,
                pendingRequests: dashboardData.pendingRequests,
              }}
            />
          </Suspense>
        </div>

        <div className="space-y-8 lg:col-span-1">
          <QuickActions />
          <Suspense fallback={<RecentReviewsSkeleton />}>
            <RecentReviews
              studentId={student.id}
              initialData={{
                recentCompletedSessions: dashboardData.recentCompletedSessions,
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function getNextSession(sessions: BookingWithTutor[]) {
  if (!sessions.length) return null;
  return [...sessions].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  )[0];
}
