
"use server";

import { requireRole } from "@/auth-utils";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function cancelBooking(bookingId: string) {
  try {
    const student = await requireRole("STUDENT");

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    if (booking.studentId !== student.id) {
      return { success: false, error: "Unauthorized." };
    }

    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
        return { success: false, error: "Only pending or confirmed sessions can be cancelled." };
    }

    await db.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    revalidatePath("/dashboard/student");

    return { success: true };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred." };
  }
}
