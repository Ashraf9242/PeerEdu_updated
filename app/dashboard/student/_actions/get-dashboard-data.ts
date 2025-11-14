
"use server";

import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";
import { differenceInHours } from "date-fns";

export async function getStudentDashboardData(studentId: string) {
  const now = new Date();

  const bookings = await db.booking.findMany({
    where: { studentId },
    include: {
      tutor: {
        select: { name: true, image: true },
      },
      review: true,
    },
    orderBy: {
      startAt: 'desc',
    },
  });

  const upcoming = bookings.filter(b => b.startAt > now && (b.status === 'CONFIRMED'));
  const pending = bookings.filter(b => b.status === 'PENDING');
  const completed = bookings.filter(b => b.status === 'COMPLETED');
  const recentCompleted = completed.slice(0, 5);

  const totalHours = completed.reduce((acc, b) => acc + differenceInHours(b.endAt, b.startAt), 0);

  const favoriteTutors = await db.booking.groupBy({
    by: ['tutorId'],
    where: {
      studentId: studentId,
      status: 'COMPLETED',
    },
    _count: {
      tutorId: true,
    },
    orderBy: {
      _count: {
        tutorId: 'desc',
      },
    },
  });

  return {
    stats: {
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      totalHours,
      favoriteTutorsCount: favoriteTutors.length,
    },
    upcomingSessions: upcoming,
    pendingRequests: pending,
    recentCompletedSessions: recentCompleted,
  };
}
