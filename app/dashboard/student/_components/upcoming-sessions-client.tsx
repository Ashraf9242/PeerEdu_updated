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
import { format } from "date-fns";
import { MoreHorizontal, X, Eye, Video } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { cancelBooking } from "../_actions/cancel-booking";

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

  const handleCancel = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this session?")) {
      startTransition(async () => {
        const result = await cancelBooking(bookingId);
        if (result.success) {
          toast.success("Session cancelled successfully.");
        } else {
          toast.error(result.error || "Failed to cancel session.");
        }
      });
    }
  };

  const allSessions = [...pendingRequests, ...upcomingSessions];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming & Pending Sessions</CardTitle>
        <CardDescription>
          Here are your scheduled and requested sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allSessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tutor</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
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
                    {format(
                      new Date(booking.startAt),
                      "EEE, MMM d, yyyy 'at' h:mm a",
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "PENDING" ? "secondary" : "default"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/bookings/${booking.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {booking.meetingLink && (
                          <DropdownMenuItem asChild>
                            <Link href={booking.meetingLink} target="_blank">
                              <Video className="mr-2 h-4 w-4" />
                              Join Session
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
                            Cancel
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
              You have no upcoming sessions.
            </p>
            <Button asChild className="mt-4">
              <Link href="/tutors">Find a Tutor</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
