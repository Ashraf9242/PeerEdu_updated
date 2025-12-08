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
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={isArabic ? "الجلسات القادمة" : "Upcoming Sessions"}
        value={stats.upcomingCount}
        icon={Clock}
      />
      <StatCard
        title={isArabic ? "الجلسات المكتملة" : "Completed Sessions"}
        value={stats.completedCount}
        icon={CheckCircle}
      />
      <StatCard
        title={isArabic ? "إجمالي الساعات" : "Total Hours"}
        value={stats.totalHours}
        icon={Book}
      />
      <StatCard
        title={isArabic ? "المعلمون المفضلون" : "Favorite Tutors"}
        value={stats.favoriteTutorsCount}
        icon={Star}
      />
    </div>
  );
}
