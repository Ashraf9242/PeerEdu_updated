"use server"

import { db } from "@/lib/db"
import { BookingStatus, UserRole } from "@prisma/client"
import { subDays } from "date-fns"

export async function getDashboardData() {
  try {
    // 1. User Stats
    const totalUsers = await db.user.count()
    const userCountsByRole = await db.user.groupBy({
      by: ["role"],
      _count: { id: true },
    })

    const userStats = {
      total: totalUsers,
      students: userCountsByRole.find((r) => r.role === UserRole.STUDENT)?._count.id || 0,
      teachers: userCountsByRole.find((r) => r.role === UserRole.TEACHER)?._count.id || 0,
      admins: userCountsByRole.find((r) => r.role === UserRole.ADMIN)?._count.id || 0,
    }

    // 2. Tutor Stats
    const approvedTutors = await db.tutorProfile.count({ where: { isApproved: true } })
    const pendingTutorsCount = await db.tutorProfile.count({ where: { isApproved: false } })

    // 3. Booking Stats
    const totalBookings = await db.booking.count()
    const bookingCountsByStatus = await db.booking.groupBy({
      by: ["status"],
      _count: { id: true },
    })

    const bookingStats = {
      total: totalBookings,
      pending: bookingCountsByStatus.find((b) => b.status === BookingStatus.PENDING)?._count.id || 0,
      confirmed: bookingCountsByStatus.find((b) => b.status === BookingStatus.CONFIRMED)?._count.id || 0,
      completed: bookingCountsByStatus.find((b) => b.status === BookingStatus.COMPLETED)?._count.id || 0,
      cancelled: bookingCountsByStatus.find((b) => b.status === BookingStatus.CANCELLED)?._count.id || 0,
    }

    // 4. Revenue Stats
    const completedBookings = await db.booking.findMany({
      where: { status: BookingStatus.COMPLETED },
      select: { price: true },
    })
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.price, 0)

    // 5. Chart Data: User growth (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30)
    const newUsers = await db.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    })
    const userGrowthData = newUsers.reduce((acc: { [key: string]: number }, user) => {
      const date = user.createdAt.toISOString().split("T")[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    // 6. Chart Data: Revenue (last 7 days)
    const sevenDaysAgo = subDays(new Date(), 7)
    const recentCompletedBookings = await db.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
        completedAt: { gte: sevenDaysAgo },
      },
      select: { completedAt: true, price: true },
    })
    const revenueData = recentCompletedBookings.reduce((acc: { [key: string]: number }, booking) => {
      if (booking.completedAt) {
        const date = booking.completedAt.toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + booking.price
      }
      return acc
    }, {})

    // 7. Pending Tutors List
    const pendingTutors = await db.tutorProfile.findMany({
      where: { isApproved: false },
      include: {
        user: {
          select: { name: true, image: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // 8. Recent Users List
    const recentUsers = await db.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    // 9. Recent Bookings List
    const recentBookings = await db.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { name: true } },
        tutor: { select: { name: true } },
      },
    })

    return {
      userStats,
      tutorStats: { approved: approvedTutors, pending: pendingTutorsCount },
      bookingStats,
      totalRevenue,
      userGrowthData,
      revenueData,
      pendingTutors,
      recentUsers,
      recentBookings,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    // In a real app, you might want to throw a more specific error
    throw new Error("Could not fetch dashboard data.")
  }
}
