
"use server";

import { requireRole } from "@/auth-utils";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const linkSchema = z.string().url();

export async function addMeetingLink(bookingId: string, link: string) {
  try {
    const teacher = await requireRole("TEACHER");

    const validation = linkSchema.safeParse(link);
    if (!validation.success) {
        return { success: false, error: "Invalid URL provided." };
    }

    const booking = await db.booking.findFirst({
      where: { 
        id: bookingId,
        tutorId: teacher.id,
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found or you are not authorized." };
    }

    if (booking.status !== 'CONFIRMED') {
        return { success: false, error: "Can only add links to confirmed sessions." };
    }

    await db.booking.update({
      where: { id: bookingId },
      data: { meetingLink: validation.data },
    });

    // TODO: Send notification to student

    revalidatePath("/dashboard/teacher");

    return { success: true };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred." };
  }
}
