import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isPast } from "date-fns";

import { requireRole } from "@/auth-utils";
import { db } from "@/lib/db";

const completeBookingSchema = z.object({
    bookingId: z.string().cuid(),
});

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user must be a teacher
        const teacher = await requireRole("TEACHER");

        // 2. Validate request body
        const body = await req.json();
        const validation = completeBookingSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { bookingId } = validation.data;

        // 3. Use a transaction to ensure atomicity
        const updatedBooking = await db.$transaction(async (prisma) => {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
            });

            // 4. Validation checks
            if (!booking) {
                throw new Error("Booking not found.");
            }
            if (booking.tutorId !== teacher.id) {
                throw new Error("Forbidden.");
            }
            if (booking.status !== 'CONFIRMED') {
                throw new Error("Only confirmed sessions can be marked as complete.");
            }
            if (!isPast(booking.endAt)) {
                throw new Error("Session has not ended yet.");
            }

            // 5. Update booking status
            const completedBooking = await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });

            // 6. Update TutorProfile totalSessions
            // This assumes a `totalSessions` field exists on the TutorProfile model.
            await prisma.tutorProfile.update({
                where: { userId: teacher.id },
                data: {
                    // If totalSessions does not exist, this line will cause an error.
                    // The schema should be updated to include: `totalSessions Int @default(0)`
                    totalSessions: { increment: 1 },
                },
            });

            return completedBooking;
        });

        // 8. TODO: Send notification to student to rate the session

        // 7. Return success response
        return NextResponse.json({ success: true, booking: updatedBooking }, { status: 200 });

    } catch (error: any) {
        console.error("[COMPLETE_BOOKING_ERROR]", error);
        
        let status = 500;
        if (error.message === "Booking not found.") status = 404;
        if (error.message === "Forbidden.") status = 403;
        if (error.message.includes("Only confirmed sessions") || error.message.includes("Session has not ended")) status = 400;

        return NextResponse.json({ success: false, error: error.message || "An unexpected error occurred." }, { status });
    }
}