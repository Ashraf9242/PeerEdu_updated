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
  const { language, t } = useLanguage();
  const locale = language === "ar" ? "ar-SA" : "en-US";

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

  const statusLabels = useMemo<Record<string, string>>(() => {
    if (language === "ar") {
      return {
        PENDING: "قيد الانتظار",
        CONFIRMED: "مؤكدة",
        COMPLETED: "مكتملة",
        CANCELLED: "ملغاة",
      };
    }
    return {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    };
  }, [language]);

  const handleCancel = (bookingId: string) => {
    if (confirm(t("dashboard.student.upcoming.cancelConfirm"))) {
      startTransition(async () => {
        const result = await cancelBooking(bookingId);
        if (result.success) {
          toast.success(t("dashboard.student.upcoming.cancelSuccess"));
        } else {
          toast.error(result.error || t("dashboard.student.upcoming.cancelError"));
        }
      });
    }
  };

  const allSessions = [...pendingRequests, ...upcomingSessions];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.student.upcoming.title")}</CardTitle>
        <CardDescription>{t("dashboard.student.upcoming.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {allSessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dashboard.student.upcoming.tutor")}</TableHead>
                <TableHead>{t("dashboard.student.upcoming.subject")}</TableHead>
                <TableHead>{t("dashboard.student.upcoming.datetime")}</TableHead>
                <TableHead>{t("dashboard.student.upcoming.status")}</TableHead>
                <TableHead>
                  <span className="sr-only">
                    {t("dashboard.student.upcoming.actions")}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSessions.map((booking) => (
                <TableRow key={booking.id} className={isPending ? "opacity-50" : ""}>
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
                  <TableCell>{dateFormatter.format(new Date(booking.startAt))}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === "PENDING" ? "secondary" : "default"}>
                      {statusLabels[booking.status] ?? booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">
                            {t("dashboard.student.upcoming.actions")}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/bookings/${booking.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("dashboard.student.upcoming.viewDetails")}
                          </Link>
                        </DropdownMenuItem>
                        {booking.meetingLink && (
                          <DropdownMenuItem asChild>
                            <Link href={booking.meetingLink} target="_blank">
                              <Video className="mr-2 h-4 w-4" />
                              {t("dashboard.student.upcoming.join")}
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                          <DropdownMenuItem
                            onClick={() => handleCancel(booking.id)}
                            disabled={isPending}
                          >
                            <X className="mr-2 h-4 w-4" />
                            {t("dashboard.student.upcoming.cancel")}
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
              {t("dashboard.student.upcoming.empty")}
            </p>
            <Button asChild className="mt-4">
              <Link href="/tutors">{t("dashboard.student.upcoming.findTutor")}</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
