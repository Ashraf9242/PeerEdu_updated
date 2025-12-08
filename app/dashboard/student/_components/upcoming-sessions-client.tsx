"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Booking, User } from "@prisma/client";
import { MoreHorizontal, X, Eye, Video } from "lucide-react";
import Link from "next/link";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { cancelBooking } from "../_actions/cancel-booking";
import { useLanguage } from "@/contexts/language-context";

export type BookingWithTutor = Booking & {
  tutor: Pick<User, "name" | "image">;
};

export interface UpcomingSessionsClientProps {
  studentId: string;
  upcomingSessions: BookingWithTutor[];
  pendingRequests: BookingWithTutor[];
}

export function UpcomingSessionsClient({
  studentId: _studentId,
  upcomingSessions,
  pendingRequests,
}: UpcomingSessionsClientProps) {
  const [isPending, startTransition] = useTransition();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const locale = isArabic ? "ar-SA" : "en-US";
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Muscat",
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    [locale],
  );
  const statusLabels = useMemo<Record<"en" | "ar", Record<string, string>>>(
    () => ({
      en: {
        PENDING: "Pending",
        CONFIRMED: "Confirmed",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
      },
      ar: {
        PENDING: "قيد الانتظار",
        CONFIRMED: "مؤكدة",
        COMPLETED: "مكتملة",
        CANCELLED: "ملغاة",
      },
    }),
    [],
  );

  const handleCancel = (bookingId: string) => {
    const question = isArabic
      ? "هل أنت متأكد من إلغاء هذه الجلسة؟"
      : "Are you sure you want to cancel this session?";
    if (confirm(question)) {
      startTransition(async () => {
        const result = await cancelBooking(bookingId);
        if (result.success) {
          toast.success(
            isArabic ? "تم إلغاء الجلسة بنجاح." : "Session cancelled successfully.",
          );
        } else {
          toast.error(
            result.error ||
              (isArabic ? "فشل إلغاء الجلسة." : "Failed to cancel session."),
          );
        }
      });
    }
  };

  const allSessions = [...pendingRequests, ...upcomingSessions];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isArabic ? "الجلسات القادمة والمعلقة" : "Upcoming & Pending Sessions"}
        </CardTitle>
        <CardDescription>
          {isArabic
            ? "هنا يمكنك متابعة الجلسات المجدولة وطلباتك قيد المراجعة."
            : "Here are your scheduled and requested sessions."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allSessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isArabic ? "المعلم" : "Tutor"}</TableHead>
                <TableHead>{isArabic ? "المادة" : "Subject"}</TableHead>
                <TableHead>{isArabic ? "التاريخ والوقت" : "Date & Time"}</TableHead>
                <TableHead>{isArabic ? "الحالة" : "Status"}</TableHead>
                <TableHead>
                  <span className="sr-only">{isArabic ? "إجراءات" : "Actions"}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSessions.map((booking) => (
                <TableRow
                  key={booking.id}
                  className={isPending ? "opacity-50" : ""}
                >
                  <TableCell className="font-medium flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={booking.tutor.image || ""}
                        alt={booking.tutor.name || ""}
                      />
                      <AvatarFallback>{booking.tutor.name?.[0]}</AvatarFallback>
                    </Avatar>
                    {booking.tutor.name}
                  </TableCell>
                  <TableCell>{booking.subject}</TableCell>
                  <TableCell>
                    {dateFormatter.format(new Date(booking.startAt))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "PENDING" ? "secondary" : "default"
                      }
                    >
                      {statusLabels[language][booking.status] ?? booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">
                            {isArabic ? "فتح القائمة" : "Toggle menu"}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/bookings/${booking.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {isArabic ? "عرض التفاصيل" : "View Details"}
                          </Link>
                        </DropdownMenuItem>
                        {booking.meetingLink && (
                          <DropdownMenuItem asChild>
                            <Link href={booking.meetingLink} target="_blank">
                              <Video className="mr-2 h-4 w-4" />
                              {isArabic ? "الانضمام للجلسة" : "Join Session"}
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {(booking.status === "PENDING" ||
                          booking.status === "CONFIRMED") && (
                          <DropdownMenuItem
                            onClick={() => handleCancel(booking.id)}
                            disabled={isPending}
                          >
                            <X className="mr-2 h-4 w-4" />
                            {isArabic ? "إلغاء" : "Cancel"}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {isArabic
                ? "لا توجد جلسات قادمة حالياً."
                : "You have no upcoming sessions."}
            </p>
            <Button asChild className="mt-4">
              <Link href="/tutors">
                {isArabic ? "ابحث عن معلم" : "Find a Tutor"}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
