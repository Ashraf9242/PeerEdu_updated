
"use server";

import { BookingStatus } from "@prisma/client";
import { requireRole } from "@/auth-utils";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(10).max(500),
    bookingId: z.string(),
});

export async function submitReview(values: z.infer<typeof reviewSchema>) {
    try {
        const student = await requireRole("STUDENT");
        const { bookingId, rating, comment } = reviewSchema.parse(values);

        const booking = await db.booking.findUnique({
            where: { id: bookingId },
            include: { review: true },
        });

        if (!booking) {
            return { success: false, error: "Booking not found." };
        }
        if (booking.studentId !== student.id) {
            return { success: false, error: "Unauthorized." };
        }
        if (booking.status !== BookingStatus.COMPLETED) {
            return { success: false, error: "Can only review completed sessions." };
        }
        if (booking.review) {
            return { success: false, error: "Session already reviewed." };
        }

        const tutorProfile = await db.tutorProfile.findUnique({
            where: { userId: booking.tutorId },
        });

        if (!tutorProfile) {
            return { success: false, error: "Tutor profile not found." };
        }

        const currentAvg = Number(tutorProfile.ratingAvg ?? 0);
        const newRatingCount = tutorProfile.ratingCount + 1;
        const newRatingAvg = (currentAvg * tutorProfile.ratingCount + rating) / newRatingCount;

        await db.$transaction([
            // Create the review
            db.review.create({
                data: {
                    bookingId,
                    rating,
                    comment,
                },
            }),
            // Update the tutor's profile
            db.tutorProfile.update({
                where: { userId: booking.tutorId },
                data: {
                    ratingCount: newRatingCount,
                    ratingAvg: newRatingAvg,
                },
            }),
        ]);

        revalidatePath("/dashboard/student");
        revalidatePath(`/tutors/${booking.tutorId}`);

        return { success: true };

    } catch (error) {
        console.error(error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
