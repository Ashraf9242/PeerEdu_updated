
import { db } from "@/lib/db";
import { NotificationType, Prisma } from "@prisma/client";

interface NotificationData {
    title: string;
    message: string;
    link?: string;
}

/**
 * Creates a notification in the database.
 * @param userId - The ID of the user to notify.
 * @param type - The type of the notification.
 * @param data - The notification content (title, message, link).
 */
export const createNotification = async (
    userId: string,
    type: NotificationType,
    data: NotificationData
) => {
    if (!userId) {
        console.error("User ID is required to create a notification.");
        return;
    }

    try {
        const notification = await db.notification.create({
            data: {
                userId,
                type,
                title: data.title,
                message: data.message,
                link: data.link,
            },
        });
        
        // Optional: Here you would trigger a real-time event, e.g., using Pusher or Socket.io
        // await pusher.trigger(`user-${userId}`, 'new-notification', notification);

        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
};

// --- Specific Notifier Functions ---

/**
 * Notifies a tutor about a new booking request.
 */
export const notifyBookingRequest = async (tutorId: string, booking: { id: string; student: { name: string } }) => {
    await createNotification(tutorId, NotificationType.BOOKING_REQUEST, {
        title: "New Booking Request",
        message: `You have a new booking request from ${booking.student.name || 'a student'}.`,
        link: `/dashboard/teacher/bookings/${booking.id}`,
    });
};

/**
 * Notifies a student that their booking was confirmed.
 */
export const notifyBookingConfirmed = async (studentId: string, booking: { id: string; tutor: { name: string } }) => {
    await createNotification(studentId, NotificationType.BOOKING_CONFIRMED, {
        title: "Booking Confirmed",
        message: `Your booking with ${booking.tutor.name || 'a tutor'} has been confirmed.`,
        link: `/dashboard/student/sessions/${booking.id}`,
    });
};

/**
 * Notifies a student that their booking was rejected.
 */
export const notifyBookingRejected = async (studentId: string, booking: { tutor: { name: string } }) => {
    await createNotification(studentId, NotificationType.BOOKING_REJECTED, {
        title: "Booking Rejected",
        message: `Your booking with ${booking.tutor.name || 'a tutor'} was not accepted.`,
        link: `/tutors`,
    });
};

/**
 * Notifies a tutor that they have received a new review.
 */
export const notifyNewReview = async (tutorId: string, review: { rating: number; student: { name: string } }) => {
    await createNotification(tutorId, NotificationType.NEW_REVIEW, {
        title: "New Review Received",
        message: `${review.student.name || 'A student'} left you a ${review.rating}-star review.`,
        link: `/dashboard/teacher/reviews`,
    });
};

/**
 * Notifies a user that their tutor application has been approved.
 */
export const notifyTutorApproved = async (tutorId: string) => {
    await createNotification(tutorId, NotificationType.TUTOR_APPROVED, {
        title: "You're a Tutor!",
        message: "Congratulations! Your application to become a tutor has been approved.",
        link: "/dashboard/teacher",
    });
};

/**
 * Notifies a user that their tutor application has been rejected.
 */
export const notifyTutorRejected = async (userId: string) => {
    await createNotification(userId, NotificationType.TUTOR_REJECTED, {
        title: "Tutor Application Update",
        message: "There's an update on your tutor application.",
        link: "/profile", // Or a more specific page
    });
};
