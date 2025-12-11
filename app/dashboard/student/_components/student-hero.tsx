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

const OMAN_UTC_OFFSET = 4;

export function StudentHeroSection({
  studentName,
  stats,
  nextSession,
  pendingCount,
}: StudentHeroProps) {
  const { language, t } = useLanguage();
  const isArabic = language === "ar";

  const greeting = getGreeting(language);
  const firstName = extractFirstName(studentName, isArabic);
  const relativeTime = nextSession && getRelativeTime(nextSession.startAt, language);
  const nextSessionText = nextSession
    ? nextSessionDescription(nextSession, relativeTime, language)
    : noSessionDescription(language);
  const pendingText = pendingDescription(pendingCount, language);

  const statsCopy = [
    {
      label: t("dashboard.student.stats.active"),
      value: `${stats.upcomingCount}`,
      helper: isArabic ? "جلسات قادمة" : "upcoming",
    },
    {
      label: t("dashboard.student.stats.hours"),
      value: `${stats.totalHours}`,
      helper: isArabic ? "ساعات مسجلة" : "hrs logged",
    },
    {
      label: t("dashboard.student.stats.completed"),
      value: `${stats.completedCount}`,
      helper: isArabic ? "جلسات" : "sessions",
    },
    {
      label: t("dashboard.student.stats.favorite"),
      value: `${stats.favoriteTutorsCount}`,
      helper: isArabic ? "معلمون مفضلون" : "favorite tutors",
    },
  ];

  const cards = buildMomentumCards({
    language,
    nextSession,
    pendingCount,
    stats,
    t,
  });

  const checklistItems = [
    t("dashboard.student.hero.checklistProfile"),
    t("dashboard.student.hero.checklistBook"),
    t("dashboard.student.hero.checklistReview"),
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-gradient-to-r from-primary via-primary/90 to-violet-600 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              {t("dashboard.student.hero.badge")}
            </span>
            <h1 className="text-4xl font-semibold leading-tight">
              {greeting}, {firstName}.
            </h1>
            <p className="text-lg text-white/85">{nextSessionText}</p>
            <p className="text-sm text-white/70">{pendingText}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {statsCopy.map(({ label, value, helper }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur"
                >
                  <p className="text-white/70">{label}</p>
                  <p className="text-2xl font-semibold text-white">{value}</p>
                  {helper && <p className="text-xs text-white/60">{helper}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-wide text-white/70">
              {t("dashboard.student.hero.control")}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/20 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {t("dashboard.student.hero.spotlightNext")}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {nextSession ? nextSession.subject : t("dashboard.student.cards.nextEmpty")}
                </p>
                <p className="text-sm text-white/70">
                  {nextSession
                    ? new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
                        dateStyle: "full",
                        timeStyle: "short",
                        timeZone: "Asia/Muscat",
                      }).format(new Date(nextSession.startAt))
                    : t("dashboard.student.hero.spotlightSubtitle")}
                </p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {t("dashboard.student.hero.spotlightPending")}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{pendingCount}</p>
                <p className="text-sm text-white/70">{pendingText}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-white/60">
                {t("dashboard.student.hero.spotlightChecklist")}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {checklistItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/85">
                    <div className="mt-1 h-2 w-2 rounded-full bg-white/60" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/tutors"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow hover:bg-white/90"
                >
                  {t("dashboard.student.hero.ctaFindTutor")}
                </Link>
                <Link
                  href="/dashboard/student/bookings"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  {t("dashboard.student.hero.ctaReview")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <p className="text-sm text-muted-foreground text-foreground">{card.detail}</p>
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
    </div>
  );
}

function extractFirstName(name: string | null, isArabic: boolean) {
  if (!name || !name.trim()) {
    return isArabic ? "هناك" : "there";
  }
  return name.trim().split(" ")[0];
}

function getGreeting(language: "en" | "ar") {
  const omanHour = (new Date().getUTCHours() + OMAN_UTC_OFFSET + 24) % 24;
  if (language === "ar") {
    if (omanHour < 12) return "صباح الخير";
    if (omanHour < 18) return "مساء الخير";
    return "ليلة سعيدة";
  }
  if (omanHour < 12) return "Good morning";
  if (omanHour < 18) return "Good afternoon";
  return "Good evening";
}

function nextSessionDescription(
  session: BookingWithTutor,
  relativeTime: string,
  language: "en" | "ar",
) {
  const tutorName = session.tutor.name || (language === "ar" ? "معلمك" : "your tutor");
  return language === "ar"
    ? `الجلسة التالية: ${session.subject} مع ${tutorName} ${relativeTime}.`
    : `Next up: ${session.subject} with ${tutorName} ${relativeTime}.`;
}

function noSessionDescription(language: "en" | "ar") {
  return language === "ar"
    ? "لا توجد جلسات مجدولة. احجز الجلسة القادمة لمواصلة التقدم."
    : "You have no sessions scheduled. Book your next tutor to keep learning momentum.";
}

function pendingDescription(count: number, language: "en" | "ar") {
  if (count > 0) {
    return language === "ar"
      ? `لديك ${count} طلب قيد الانتظار.`
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
  t,
}: {
  language: "en" | "ar";
  nextSession: BookingWithTutor | null;
  pendingCount: number;
  stats: StudentStats;
  t: (key: string) => string;
}) {
  const locale = language === "ar" ? "ar-SA" : "en-US";
  const nextSessionTime = nextSession
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Muscat",
      }).format(new Date(nextSession.startAt))
    : null;

  return [
    {
      title: t("dashboard.student.cards.next"),
      description: nextSession
        ? language === "ar"
          ? `${nextSession.subject} مع ${nextSession.tutor.name || "معلمك"}`
          : `${nextSession.subject} with ${nextSession.tutor.name || "your tutor"}`
        : t("dashboard.student.cards.nextEmpty"),
      detail: nextSession
        ? nextSessionTime
        : language === "ar"
          ? "استخدم الإجراءات السريعة لحجز جلستك القادمة."
          : "Use quick actions to book your next study block.",
      icon: CalendarClock,
      link: nextSession ? `/bookings/${nextSession.id}` : "/tutors",
      linkLabel: nextSession
        ? t("dashboard.student.cards.viewBooking")
        : t("dashboard.student.cards.browseTutors"),
    },
    {
      title: t("dashboard.student.cards.pending"),
      description:
        pendingCount > 0
          ? language === "ar"
            ? `لديك ${pendingCount} طلب ينتظر الموافقة.`
            : `You have ${pendingCount} request${pendingCount === 1 ? "" : "s"} waiting for confirmation.`
          : t("dashboard.student.cards.pendingClear"),
      detail:
        pendingCount > 0
          ? language === "ar"
            ? "سنخطرك بمجرد رد المعلمين."
            : "We'll notify you as soon as your tutors respond."
          : language === "ar"
            ? "يمكنك طلب المزيد من الجلسات في أي وقت."
            : "Feel free to request more sessions anytime.",
      icon: BellRing,
      link: "/dashboard/student#sessions",
      linkLabel: t("dashboard.student.cards.manageRequests"),
    },
    {
      title: t("dashboard.student.cards.streak"),
      description:
        language === "ar"
          ? `${stats.completedCount} جلسات مكتملة مع ${stats.totalHours} ساعة دراسة حتى الآن.`
          : `${stats.completedCount} sessions completed with ${stats.totalHours} study hours logged so far.`,
      detail:
        language === "ar"
          ? "أضف المزيد من الجلسات لتحافظ على استمراريتك."
          : "Add more sessions to keep your streak growing.",
      icon: Target,
      link: "/dashboard/student/bookings",
      linkLabel: t("dashboard.student.cards.viewHistory"),
    },
  ];
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
