
"use server";

import { db } from "@/lib/db";
import { subDays, startOfDay } from "date-fns";

export async function getTeacherDashboardData(teacherId: string) {
  const now = new Date();
  const sevenDaysAgo = startOfDay(subDays(now, 6));

  const bookings = await db.booking.findMany({
    where: { teacherId },
    include: {
      student: {
        select: { name: true, image: true },
      },
    },
    orderBy: {
      startAt: 'asc',
    },
  });

  const tutorProfile = await db.tutorProfile.findUnique({
      where: { userId: teacherId }
  });

  const pending = bookings.filter(b => b.status === 'PENDING');
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED' && b.startAt > now);
  const completed = bookings.filter(b => b.status === 'COMPLETED');

  const projectedEarnings = confirmed.reduce((acc, b) => acc + b.price, 0);

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = startOfDay(subDays(now, i));
    const dayBookings = bookings.filter(b => 
        b.status === 'COMPLETED' && 
        startOfDay(new Date(b.startAt)).getTime() === date.getTime()
    );
    return {
      date: date.toISOString().split('T')[0],
      sessions: dayBookings.length,
    };
  }).reverse();

  return {
    stats: {
      pendingCount: pending.length,
      confirmedCount: confirmed.length,
      totalSessions: completed.length,
      ratingAvg: tutorProfile?.ratingAvg || 0,
      projectedEarnings,
    },
    pendingRequests: pending,
    upcomingSessions: confirmed,
    chartData,
  };
}
