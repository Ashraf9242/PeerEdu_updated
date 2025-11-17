import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/auth-utils";

const reviewSchema = z.object({
  bookingId: z.string().cuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = reviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { bookingId, rating, comment } = validation.data;

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    if (booking.studentId !== user.id) {
      return NextResponse.json({ success: false, error: "You are not authorized to review this booking." }, { status: 403 });
    }

    if (booking.status !== 'COMPLETED') {
      return NextResponse.json({ success: false, error: "You can only review completed bookings." }, { status: 400 });
    }

    const existingReview = await db.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      return NextResponse.json({ success: false, error: "A review for this booking already exists." }, { status: 409 });
    }

    const [newReview] = await db.$transaction(async (prisma) => {
      const createdReview = await prisma.review.create({
        data: {
          bookingId,
          rating,
          comment,
        },
      });

      const tutorReviews = await prisma.review.findMany({
        where: {
          booking: {
            tutorId: booking.tutorId,
          },
        },
        select: {
          rating: true,
        },
      });

      const totalRatings = tutorReviews.length;
      const averageRating = tutorReviews.reduce((acc, review) => acc + review.rating, 0) / totalRatings;

      await prisma.tutorProfile.update({
        where: {
          userId: booking.tutorId,
        },
        data: {
          ratingAvg: averageRating,
          ratingCount: totalRatings,
        },
      });
      
      // As per schema analysis, Notification model does not exist.
      // If it were to be added, the creation logic would go here.
      // For example:
      // await prisma.notification.create({
      //   data: {
      //     userId: booking.tutorId,
      //     message: `You have a new review from ${user.name || 'a student'}.`,
      //   },
      // });

      return [createdReview];
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });

  } catch (error) {
    console.error("Review creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
  }
}
