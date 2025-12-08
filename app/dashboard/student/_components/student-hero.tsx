"use client";

import Link from "next/link";
import { CalendarClock, Sparkles, BellRing, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import type { BookingWithTutor } from "./upcoming-sessions-client";

type StudentStats = {
  upcomingCount: number;
  completedCount: number;
  totalHours: number;
  favoriteTutorsCount: number;
};

interface StudentHeroProps {
  studentName: string | null;
  stats: StudentStats;
  nextSession: BookingWithTutor | null;
  pendingCount: number;
}

const OMAN_UTC_OFFSET = 4; // UTC+4 with no DST

export function StudentHeroSection({
  studentName,
  stats,
  nextSession,
  pendingCount,
}: StudentHeroProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const greeting = getGreeting(language);
  const firstName = extractFirstName(studentName, isArabic);
  const relativeTime =
    nextSession && getRelativeTime(nextSession.startAt, language);
  const nextSessionText = nextSession
    ? nextSessionDescription(nextSession, relativeTime, language)
    : noSessionDescription(language);
  const pendingText = pendingDescription(pendingCount, language);

  const statsCopy = [
    {
      label: isArabic ? "جلسات حالية" : "Active Sessions",
      value: `${stats.upcomingCount} ${isArabic ? "قادمة" : "upcoming"}`,
    },
    {
      label: isArabic ? "ساعات التعلم" : "Learning Hours",
      value: `${stats.totalHours} ${isArabic ? "ساعة مسجلة" : "hrs logged"}`,
    },
    {
      label: isArabic ? "جلسات مكتملة" : "Completed",
      value: `${stats.completedCount} ${
        isArabic ? "جلسة" : "sessions"
      }`,
    },
  ];

  const cards = buildMomentumCards({
    language,
    nextSession,
    pendingCount,
    stats,
  });

  return (
    <section className="rounded-3xl border bg-gradient-to-r from-primary via-primary/90 to-violet-600 p-8 text-white shadow-xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            {isArabic ? "عرض مخصص" : "Personalized view"}
          </span>
          <h1 className="text-4xl font-semibold leading-tight">
            {greeting}, {firstName}.
          </h1>
          <p className="text-lg text-white/85">{nextSessionText}</p>
          <p className="text-sm text-white/70">{pendingText}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            {statsCopy.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur"
              >
                <p className="text-white/70">{label}</p>
                <p className="text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur lg:w-96">
          <p className="text-sm uppercase tracking-wide text-white/70">
            {isArabic ? "مركز التحكم" : "Control Center"}
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3 text-white/90">
              <div className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
              {isArabic
                ? "استمر في استكشاف المعلمين الذين يناسبون أهدافك الدراسية واحفظ المفضلين لديك."
                : "Keep exploring tutors that match your study goals and bookmark your favorites."}
            </li>
            <li className="flex items-start gap-3 text-white/90">
              <div className="mt-1 h-2 w-2 rounded-full bg-orange-200" />
              {isArabic
                ? "قيّم الجلسات المكتملة لمساعدة زملائك على العثور على معلمين متميزين بسرعة."
                : "Rate completed sessions to help peers find great mentors faster."}
            </li>
            <li className="flex items-start gap-3 text-white/90">
              <div className="mt-1 h-2 w-2 rounded-full bg-sky-200" />
              {isArabic
                ? "استخدم الإجراءات السريعة للانتقال مباشرة إلى الحجوزات أو الرسائل أو البحث عن معلم."
                : "Use quick actions to jump into bookings, messages, or tutor search."}
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/tutors"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow hover:bg-white/90"
            >
              {isArabic ? "ابحث عن معلم" : "Find a Tutor"}
            </Link>
            <Link
              href="/dashboard/student/bookings"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {isArabic ? "مراجعة الجلسات" : "Review Sessions"}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="h-full">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-foreground">
                {card.detail}
              </p>
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
    </section>
  );
}

function extractFirstName(name: string | null, isArabic: boolean) {
  if (!name || !name.trim()) {
    return isArabic ? "صديقي" : "there";
  }
  return name.trim().split(" ")[0];
}

function getGreeting(language: "en" | "ar") {
  const omanHour = (new Date().getUTCHours() + OMAN_UTC_OFFSET + 24) % 24;
  const key =
    omanHour < 12 ? "morning" : omanHour < 18 ? "afternoon" : "evening";
  if (language === "ar") {
    return key === "morning"
      ? "صباح الخير"
      : key === "afternoon"
        ? "مساء الخير"
        : "مساء سعيد";
  }
  return key === "morning"
    ? "Good morning"
    : key === "afternoon"
      ? "Good afternoon"
      : "Good evening";
}

function nextSessionDescription(
  session: BookingWithTutor,
  relativeTime: string,
  language: "en" | "ar",
) {
  const tutorName = session.tutor.name || (language === "ar" ? "معلمك" : "your tutor");
  return language === "ar"
    ? `الجلسة القادمة: ${session.subject} مع ${tutorName} ${relativeTime}.`
    : `Next up: ${session.subject} with ${tutorName} ${relativeTime}.`;
}

function noSessionDescription(language: "en" | "ar") {
  return language === "ar"
    ? "لا توجد جلسات مجدولة. احجز جلستك القادمة للحفاظ على زخم التعلم."
    : "You have no sessions scheduled. Book your next tutor to keep learning momentum.";
}

function pendingDescription(count: number, language: "en" | "ar") {
  if (count > 0) {
    return language === "ar"
      ? `لديك ${count} طلب${count === 1 ? "" : "ًا"} قيد التأكيد.`
      : `${count} request${count === 1 ? "" : "s"} awaiting confirmation.`;
  }
  return language === "ar"
    ? "لا توجد طلبات معلقة."
    : "All requests are cleared.";
}

function buildMomentumCards({
  language,
  nextSession,
  pendingCount,
  stats,
}: {
  language: "en" | "ar";
  nextSession: BookingWithTutor | null;
  pendingCount: number;
  stats: StudentStats;
}) {
  const locale = language === "ar" ? "ar-SA" : "en-US";
  const nextSessionTime = nextSession
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Muscat",
      }).format(new Date(nextSession.startAt))
    : null;

  const cards = [
    {
      title: language === "ar" ? "القادم في جدولك" : "Next on your calendar",
      description: nextSession
        ? language === "ar"
          ? `${nextSession.subject} مع ${nextSession.tutor.name || "معلمك"}`
          : `${nextSession.subject} with ${nextSession.tutor.name || "your tutor"}`
        : language === "ar"
          ? "لا توجد جلسات قادمة."
          : "No upcoming sessions scheduled.",
      detail: nextSession
        ? nextSessionTime
        : language === "ar"
          ? "استخدم الإجراءات السريعة لحجز جلستك القادمة."
          : "Use quick actions to book your next study block.",
      icon: CalendarClock,
      link: nextSession ? `/bookings/${nextSession.id}` : "/tutors",
      linkLabel: nextSession
        ? language === "ar"
          ? "عرض الحجز"
          : "View booking"
        : language === "ar"
          ? "استعراض المعلمين"
          : "Browse tutors",
    },
    {
      title: language === "ar" ? "طلبات في الانتظار" : "Pending approvals",
      description:
        pendingCount > 0
          ? language === "ar"
            ? `لديك ${pendingCount} طلب بانتظار الرد.`
            : `You have ${pendingCount} request${
                pendingCount === 1 ? "" : "s"
              } waiting for confirmation.`
          : language === "ar"
            ? "تمت الموافقة على جميع الطلبات."
            : "All session requests are confirmed.",
      detail:
        pendingCount > 0
          ? language === "ar"
            ? "سنخطرك فور رد المعلمين."
            : "We’ll notify you as soon as your tutors respond."
          : language === "ar"
            ? "يمكنك طلب المزيد من الجلسات في أي وقت."
            : "Feel free to request more sessions anytime.",
      icon: BellRing,
      link: "/dashboard/student#sessions",
      linkLabel:
        language === "ar" ? "إدارة الطلبات" : "Manage requests",
    },
    {
      title: language === "ar" ? "سلسلة التعلم" : "Learning streak",
      description:
        language === "ar"
          ? `${stats.completedCount} جلسة مكتملة و ${stats.totalHours} ساعة مسجلة حتى الآن.`
          : `${stats.completedCount} sessions completed with ${stats.totalHours} study hours logged so far.`,
      detail:
        language === "ar"
          ? "أضف مزيدًا من الجلسات للحفاظ على تقدمك."
          : "Add more sessions to keep your streak growing.",
      icon: Target,
      link: "/dashboard/student/bookings",
      linkLabel:
        language === "ar" ? "سجل الجلسات" : "View history",
    },
  ];

  return cards;
}

function getRelativeTime(
  dateInput: string | Date,
  language: "en" | "ar",
) {
  const target = new Date(dateInput);
  const diffMs = target.getTime() - Date.now();
  const minutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat(
    language === "ar" ? "ar" : "en",
    { numeric: "auto" },
  );

  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, "minute");
  }

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return formatter.format(hours, "hour");
  }

  const days = Math.round(hours / 24);
  return formatter.format(days, "day");
}
