"use client";

import { Book, CheckCircle, Clock, Star } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { StatCard } from "./stat-card";

type StudentStats = {
  upcomingCount: number;
  completedCount: number;
  totalHours: number;
  favoriteTutorsCount: number;
};

interface StatsGridProps {
  stats: StudentStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const { language, t } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("dashboard.student.stats.active")}
        value={`${stats.upcomingCount} ${isArabic ? "قادمة" : "upcoming"}`}
        icon={Clock}
      />
      <StatCard
        title={t("dashboard.student.stats.completed")}
        value={`${stats.completedCount} ${isArabic ? "جلسات" : "sessions"}`}
        icon={CheckCircle}
      />
      <StatCard
        title={t("dashboard.student.stats.hours")}
        value={`${stats.totalHours} ${isArabic ? "ساعة" : "hrs"}`}
        icon={Book}
      />
      <StatCard
        title={t("dashboard.student.stats.favorite")}
        value={stats.favoriteTutorsCount}
        icon={Star}
      />
    </div>
  );
}
