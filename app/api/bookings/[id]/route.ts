
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { differenceInHours } from "date-fns";

import { getCurrentUser } from "@/auth-utils";
import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";

const updateBookingSchema = z.object({
    status: z.nativeEnum(BookingStatus).optional(),
    meetingLink: z.string().url().optional(),
    notes: z.string().optional(),
});

// GET /api/bookings/[id] - Fetch details of a specific booking
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const booking = await db.booking.findUnique({
            where: { id: params.id },
            include: {
                student: { select: { id: true, name: true, image: true } },
                tutor: { select: { id: true, name: true, image: true } },
                review: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
        }

        // Authorize: User must be the student or the tutor involved
        if (user.id !== booking.studentId && user.id !== booking.tutorId) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ success: true, booking });

    } catch (error) {
        console.error(`[GET_BOOKING_${params.id}]`, error);
        return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
    }
}

// PUT /api/bookings/[id] - Update a booking (status, meeting link, etc.)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = updateBookingSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const bookingToUpdate = await db.booking.findUnique({
            where: { id: params.id },
        });

        if (!bookingToUpdate) {
            return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
        }

        const { status, meetingLink, notes } = validation.data;
        let updateData: any = {};

        // Teacher-specific actions
        if (user.role === 'TEACHER' && user.id === bookingToUpdate.tutorId) {
            if (status && (status === 'CONFIRMED' || status === 'REJECTED')) {
                updateData.status = status;
                if (status === 'REJECTED' && notes) updateData.notes = notes;
            }
            if (meetingLink) {
                updateData.meetingLink = meetingLink;
            }
        }
        // Student-specific actions
        else if (user.role === 'STUDENT' && user.id === bookingToUpdate.studentId) {
            if (status && status === 'CANCELLED') {
                const now = new Date();
                const canCancelPending = bookingToUpdate.status === 'PENDING';
                const canCancelConfirmed = bookingToUpdate.status === 'CONFIRMED' && differenceInHours(bookingToUpdate.startAt, now) >= 24;

                if (canCancelPending || canCancelConfirmed) {
                    updateData.status = 'CANCELLED';
                } else {
                    return NextResponse.json({ success: false, error: "Cancellation window has passed." }, { status: 400 });
                }
            }
        } else {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }
        
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, error: "No valid update parameters provided." }, { status: 400 });
        }

        const updatedBooking = await db.booking.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json({ success: true, booking: updatedBooking });

    } catch (error) {
        console.error(`[PUT_BOOKING_${params.id}]`, error);
        return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
    }
}

// DELETE /api/bookings/[id] - Delete a booking
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const bookingToDelete = await db.booking.findUnique({
            where: { id: params.id },
        });

        if (!bookingToDelete) {
            return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
        }

        const canDelete = user.role === 'ADMIN' || 
                          (bookingToDelete.status === 'CANCELLED' || bookingToDelete.status === 'REJECTED');

        if (!canDelete) {
            return NextResponse.json({ success: false, error: "Booking cannot be deleted in its current state." }, { status: 403 });
        }

        await db.booking.delete({
            where: { id: params.id },
        });

        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error(`[DELETE_BOOKING_${params.id}]`, error);
        return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
    }
}
