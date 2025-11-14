
"use server";

import { requireRole } from "@/auth-utils";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function rejectBooking(bookingId: string, reason?: string) {
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

    await db.booking.update({
      where: { id: bookingId },
      data: { 
        status: 'REJECTED',
        notes: reason,
      },
    });

    // TODO: Send notification to student

    revalidatePath("/dashboard/teacher");

    return { success: true };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred." };
  }
}
