
"use server";

import { requireRole } from "@/auth-utils";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function acceptBooking(bookingId: string) {
  try {
    const teacher = await requireRole("TEACHER");

    const booking = await db.booking.findFirst({
      where: { 
        id: bookingId,
        tutorId: teacher.id,
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found or you are not authorized." };
    }

    if (booking.status !== 'PENDING') {
        return { success: false, error: "This booking is not pending." };
    }

    // Check for conflicts before accepting
    const conflictingBooking = await db.booking.findFirst({
        where: {
            tutorId: teacher.id,
            status: 'CONFIRMED',
            id: { not: bookingId },
            startAt: { lt: booking.endAt },
            endAt: { gt: booking.startAt },
        }
    });

    if (conflictingBooking) {
        return { success: false, error: "You have a conflicting booking at this time." };
    }

    await db.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });

    // TODO: Send notification to student

    revalidatePath("/dashboard/teacher");

    return { success: true };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred." };
  }
}
