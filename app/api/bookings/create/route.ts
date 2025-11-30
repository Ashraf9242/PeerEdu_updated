
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { differenceInHours, isFuture, isAfter } from "date-fns";
import { BookingStatus, Role } from "@prisma/client";

import { requireRole } from "@/auth-utils";
import { db } from "@/lib/db";

const bookingSchema = z.object({
    tutorId: z.string().cuid(),
    subject: z.string().min(2, "Subject must be at least 2 characters."),
    description: z.string().optional(),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
}).refine(data => isFuture(data.startAt), {
    message: "Booking start time must be in the future.",
    path: ["startAt"],
}).refine(data => isAfter(data.endAt, data.startAt), {
    message: "End time must be after start time.",
    path: ["endAt"],
}).refine(data => {
    const hours = differenceInHours(data.endAt, data.startAt);
    return hours >= 1;
}, {
    message: "Booking must be for at least 1 hour.",
    path: ["duration"],
}).refine(data => {
    const hours = differenceInHours(data.endAt, data.startAt);
    return Number.isInteger(hours);
}, {
    message: "Booking duration must be in whole hours (e.g., 1, 2, 3 hours).",
    path: ["duration"],
});


export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user must be a student
        const student = await requireRole("STUDENT");

        // 2. Validate request body
        const body = await req.json();
        const validation = bookingSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { tutorId, subject, description, startAt, endAt } = validation.data;

        // 3. Fetch tutor and check availability
        const tutor = await db.user.findFirst({
            where: { id: tutorId, role: Role.TEACHER },
            include: {
                tutorProfile: true,
                availabilities: true,
                tutorBookings: {
                    where: {
                        OR: [{ startAt: { lt: endAt }, endAt: { gt: startAt } }],
                        status: { notIn: [BookingStatus.CANCELLED, BookingStatus.REJECTED] }
                    }
                }
            }
        });

        if (!tutor || !tutor.tutorProfile?.isApproved) {
            return NextResponse.json({ success: false, error: "Tutor not found or not available." }, { status: 404 });
        }

        // 4. Check for booking conflicts
        if (tutor.tutorBookings.length > 0) {
            return NextResponse.json({ success: false, error: "The selected time slot is no longer available." }, { status: 409 });
        }

        // 5. Verify the requested time is within the tutor's general availability
        // This is a simplified check. A more robust solution would check slot by slot.
        const dayOfWeek = startAt.getDay();
        const isAvailable = tutor.availabilities.some(avail => {
            const startHour = parseInt(avail.startTime.split(':')[0]);
            const endHour = parseInt(avail.endTime.split(':')[0]);
            return avail.weekday === dayOfWeek &&
                   startAt.getHours() >= startHour &&
                   endAt.getHours() <= endHour;
        });

        if (!isAvailable) {
            return NextResponse.json({ success: false, error: "The tutor is not available at the selected time." }, { status: 400 });
        }

        // 6. Calculate price
        const durationInHours = differenceInHours(endAt, startAt);
        const hourlyRate = Number(tutor.tutorProfile.hourlyRate);
        const price = durationInHours * hourlyRate;

        // 7. Create the booking
        const newBooking = await db.booking.create({
            data: {
                studentId: student.id,
                tutorId: tutor.id,
                subject,
                description,
                startAt,
                endAt,
                price,
                status: BookingStatus.PENDING,
            }
        });

        // 8. TODO: Send notifications (optional)

        // 9. Return success response
        return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });

    } catch (error) {
        console.error("Booking creation error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
        }
        // Handle other potential errors, like auth errors
        return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
    }
}
