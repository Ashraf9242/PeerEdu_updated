import Link from "next/link";
import { Suspense } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Book, CalendarClock, CheckCircle, Clock, Sparkles, Star, BellRing, Target } from "lucide-react";

import { requireRole } from "@/auth-utils";
import { StatCard } from "./_components/stat-card";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookingWithTutor } from "./_components/upcoming-sessions-client";

type DashboardData = Awaited<ReturnType<typeof getStudentDashboardData>>;
type StudentStats = DashboardData["stats"];

export default async function StudentDashboardPage() {
  const student = await requireRole("STUDENT");
  const dashboardData = await getStudentDashboardData(student.id);
  const nextSession = getNextSession(dashboardData.upcomingSessions);
  const pendingCount = dashboardData.pendingRequests.length;

  return (
    <div className="space-y-8">
      <StudentHero
        studentName={student.name}
        stats={dashboardData.stats}
        nextSession={nextSession}
        pendingCount={pendingCount}
      />

      <StatsGrid stats={dashboardData.stats} />

      <MomentumHighlights
        nextSession={nextSession}
        pendingCount={pendingCount}
        stats={dashboardData.stats}
      />

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

function StatsGrid({ stats }: { stats: StudentStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Upcoming Sessions" value={stats.upcomingCount} icon={Clock} />
      <StatCard title="Completed Sessions" value={stats.completedCount} icon={CheckCircle} />
      <StatCard title="Total Hours" value={stats.totalHours} icon={Book} />
      <StatCard title="Favorite Tutors" value={stats.favoriteTutorsCount} icon={Star} />
    </div>
  );
}

function StudentHero({
  studentName,
  stats,
  nextSession,
  pendingCount,
}: {
  studentName: string | null;
  stats: StudentStats;
  nextSession: BookingWithTutor | null;
  pendingCount: number;
}) {
  const greeting = getGreeting();
  const firstName = (studentName ?? "there").split(" ")[0];
  const momentumLine = nextSession
    ? `Next up: ${nextSession.subject} with ${nextSession.tutor.name ?? "your tutor"} ${formatDistanceToNow(new Date(nextSession.startAt), { addSuffix: true })}.`
    : "You have no sessions scheduled. Book your next tutor to keep learning momentum.";
  const pendingLine =
    pendingCount > 0
      ? `${pendingCount} request${pendingCount === 1 ? "" : "s"} awaiting confirmation.`
      : "All requests are cleared.";

  return (
    <section className="rounded-3xl border bg-gradient-to-r from-primary via-primary/90 to-violet-600 p-8 text-white shadow-xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Personalized view
          </span>
          <h1 className="text-4xl font-semibold leading-tight">
            {greeting}, {firstName}.
          </h1>
          <p className="text-lg text-white/85">{momentumLine}</p>
          <p className="text-sm text-white/70">{pendingLine}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <HeroStat label="Active Sessions" value={`${stats.upcomingCount} upcoming`} />
            <HeroStat label="Learning Hours" value={`${stats.totalHours} hrs logged`} />
            <HeroStat label="Completed" value={`${stats.completedCount} sessions`} />
          </div>
        </div>
        <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur lg:w-96">
          <p className="text-sm uppercase tracking-wide text-white/70">
            Control Center
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3 text-white/90">
              <div className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
              Keep exploring tutors that match your study goals and bookmark your favorites.
            </li>
            <li className="flex items-start gap-3 text-white/90">
              <div className="mt-1 h-2 w-2 rounded-full bg-orange-200" />
              Rate completed sessions to help peers find great mentors faster.
            </li>
            <li className="flex items-start gap-3 text-white/90">
              <div className="mt-1 h-2 w-2 rounded-full bg-sky-200" />
              Use quick actions to jump into bookings, messages, or tutor search.
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/tutors"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow hover:bg-white/90"
            >
              Find a Tutor
            </Link>
            <Link
              href="/dashboard/student/bookings"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Review Sessions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur">
      <p className="text-white/70">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function MomentumHighlights({
  nextSession,
  pendingCount,
  stats,
}: {
  nextSession: BookingWithTutor | null;
  pendingCount: number;
  stats: StudentStats;
}) {
  const cards = [
    {
      title: "Next on your calendar",
      description: nextSession
        ? `${nextSession.subject} with ${nextSession.tutor.name ?? "your tutor"}`
        : "No upcoming sessions scheduled.",
      detail: nextSession
        ? format(new Date(nextSession.startAt), "EEE, MMM d · h:mm a")
        : "Use quick actions to book your next study block.",
      icon: CalendarClock,
      link: nextSession ? `/bookings/${nextSession.id}` : "/tutors",
      linkLabel: nextSession ? "View booking" : "Browse tutors",
    },
    {
      title: "Pending approvals",
      description:
        pendingCount > 0
          ? `You have ${pendingCount} request${pendingCount === 1 ? "" : "s"} waiting for confirmation.`
          : "All session requests are confirmed.",
      detail:
        pendingCount > 0
          ? "We’ll notify you as soon as your tutors respond."
          : "Feel free to request more sessions anytime.",
      icon: BellRing,
      link: "/dashboard/student#sessions",
      linkLabel: "Manage requests",
    },
    {
      title: "Learning streak",
      description: `${stats.completedCount} sessions completed with ${stats.totalHours} study hours logged so far.`,
      detail: "Add more sessions to keep your streak growing.",
      icon: Target,
      link: "/dashboard/student/bookings",
      linkLabel: "View history",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ icon: Icon, ...card }) => (
        <Card key={card.title} className="h-full">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">{card.detail}</p>
            <Link
              href={card.link}
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {card.linkLabel}
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getNextSession(sessions: BookingWithTutor[]) {
  if (!sessions.length) return null;
  return [...sessions].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  )[0];
}
