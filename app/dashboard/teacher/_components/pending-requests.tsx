
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
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { getTeacherDashboardData } from "../_actions/get-dashboard-data";
import { format, differenceInHours } from "date-fns";
import { Check, X } from "lucide-react";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { acceptBooking } from "../_actions/accept-booking";
import { rejectBooking } from "../_actions/reject-booking";
import { Skeleton } from "@/components/ui/skeleton";

type TeacherDashboardData = Awaited<ReturnType<typeof getTeacherDashboardData>>;
type PendingBooking = TeacherDashboardData["pendingRequests"][number];

interface PendingRequestsProps {
    teacherId: string;
    pendingRequests: PendingBooking[];
}

// Async component wrapper
export async function PendingRequests({ teacherId }: { teacherId: string }) {
    const { getTeacherDashboardData } = await import("../_actions/get-dashboard-data");
    const { pendingRequests } = await getTeacherDashboardData(teacherId);
    return <PendingRequestsClient teacherId={teacherId} pendingRequests={pendingRequests} />;
}

export function PendingRequestsClient({ pendingRequests }: PendingRequestsProps) {
    const [isPending, startTransition] = useTransition();
    const [rejectionReason, setRejectionReason] = useState("");

    const handleAccept = (bookingId: string) => {
        startTransition(async () => {
            const result = await acceptBooking(bookingId);
            if (result.success) toast.success("Booking accepted!");
            else toast.error(result.error);
        });
    };

    const handleReject = (bookingId: string) => {
        startTransition(async () => {
            const result = await rejectBooking(bookingId, rejectionReason);
            if (result.success) toast.success("Booking rejected.");
            else toast.error(result.error);
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Booking Requests</CardTitle>
                <CardDescription>Accept or reject new requests from students.</CardDescription>
            </CardHeader>
            <CardContent>
                {pendingRequests.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingRequests.map((booking) => (
                                <TableRow key={booking.id} className={isPending ? "opacity-50" : ""}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={booking.student.image || ''} alt={booking.student.name || ''} />
                                            <AvatarFallback>{booking.student.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        {booking.student.name}
                                    </TableCell>
                                    <TableCell>{format(new Date(booking.startAt), "MMM d, h:mm a")}</TableCell>
                                    <TableCell>{differenceInHours(booking.endAt, booking.startAt)}h</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="icon" variant="outline" className="text-green-500" onClick={() => handleAccept(booking.id)} disabled={isPending}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="icon" variant="outline" className="text-red-500">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Reject Booking</DialogTitle>
                                                    <DialogDescription>
                                                        Please provide a reason for rejection (optional).
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <Label htmlFor="reason">Reason</Label>
                                                    <Input id="reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                                                </div>
                                                <Button variant="destructive" onClick={() => handleReject(booking.id)} disabled={isPending}>
                                                    Confirm Rejection
                                                </Button>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-10">No pending requests.</p>
                )}
            </CardContent>
        </Card>
    );
}

export function PendingRequestsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
