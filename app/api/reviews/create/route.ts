import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { requireRole } from "@/auth-utils";
import { db } from "@/lib/db";

const createReviewSchema = z.object({
    bookingId: z.string().cuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user must be a student
        const student = await requireRole("STUDENT");

        // 2. Validate request body
        const body = await req.json();
        const validation = createReviewSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { bookingId, rating, comment } = validation.data;

        const newReview = await db.$transaction(async (prisma) => {
            // 4. Validation checks
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { review: true },
            });

            if (!booking) {
                throw new Error("Booking not found.");
            }
            if (booking.studentId !== student.id) {
                throw new Error("Forbidden: You can only review your own sessions.");
            }
            if (booking.status !== 'COMPLETED') {
                throw new Error("Only completed sessions can be reviewed.");
            }
            if (booking.review) {
                throw new Error("This session has already been reviewed.");
            }

            // 5. Create the Review
            const review = await prisma.review.create({
                data: {
                    bookingId,
                    rating,
                    comment,
                },
            });

            // 6. Update TutorProfile with new average rating
            const tutorReviews = await prisma.review.findMany({
                where: {
                    booking: {
                        tutorId: booking.tutorId,
                    },
                },
                select: { rating: true },
            });

            const totalRatings = tutorReviews.reduce((acc, r) => acc + r.rating, 0);
            const ratingCount = tutorReviews.length;
            const ratingAvg = ratingCount > 0 ? totalRatings / ratingCount : 0;

            await prisma.tutorProfile.update({
                where: { userId: booking.tutorId },
                data: {
                    ratingCount,
                    ratingAvg,
                },
            });

            return review;
        });

        // 8. TODO: Send notification to the tutor

        // 7. Return success response
        return NextResponse.json({ success: true, review: newReview }, { status: 201 });

    } catch (error: any) {
        console.error("[CREATE_REVIEW_ERROR]", error);
        
        let status = 500;
        if (error.message.includes("Booking not found")) status = 404;
        if (error.message.includes("Forbidden")) status = 403;
        if (error.message.includes("Only completed sessions") || error.message.includes("already been reviewed")) status = 400;

        return NextResponse.json({ success: false, error: error.message || "An unexpected error occurred." }, { status });
    }
}