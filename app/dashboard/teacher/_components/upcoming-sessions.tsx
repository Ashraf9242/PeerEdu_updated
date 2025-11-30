
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
import { format } from "date-fns";
import { Link, MoreHorizontal } from "lucide-react";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { addMeetingLink } from "../_actions/add-meeting-link";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type TeacherDashboardData = Awaited<ReturnType<typeof getTeacherDashboardData>>;
type UpcomingBooking = TeacherDashboardData["upcomingSessions"][number];

interface UpcomingSessionsProps {
    teacherId: string;
    upcomingSessions: UpcomingBooking[];
}

// Async component wrapper
export async function UpcomingSessions({ teacherId }: { teacherId: string }) {
    const { getTeacherDashboardData } = await import("../_actions/get-dashboard-data");
    const { upcomingSessions } = await getTeacherDashboardData(teacherId);
    return <UpcomingSessionsClient teacherId={teacherId} upcomingSessions={upcomingSessions} />;
}

export function UpcomingSessionsClient({ upcomingSessions }: UpcomingSessionsProps) {
    const [isPending, startTransition] = useTransition();
    const [meetingLink, setMeetingLink] = useState("");

    const handleAddLink = (bookingId: string) => {
        if (!meetingLink || !URL.canParse(meetingLink)) {
            toast.error("Please enter a valid URL.");
            return;
        }
        startTransition(async () => {
            const result = await addMeetingLink(bookingId, meetingLink);
            if (result.success) toast.success("Meeting link added.");
            else toast.error(result.error);
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your confirmed future sessions.</CardDescription>
            </CardHeader>
            <CardContent>
                {upcomingSessions.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Meeting Link</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {upcomingSessions.map((booking) => (
                                <TableRow key={booking.id} className={isPending ? "opacity-50" : ""}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={booking.student.image || ''} alt={booking.student.name || ''} />
                                            <AvatarFallback>{booking.student.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        {booking.student.name}
                                    </TableCell>
                                    <TableCell>{format(new Date(booking.startAt), "MMM d, h:mm a")}</TableCell>
                                    <TableCell>
                                        {booking.meetingLink ? (
                                            <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                Join
                                            </a>
                                        ) : (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm">Add Link</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Add Meeting Link</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <Label htmlFor="link">Meeting URL</Label>
                                                        <Input id="link" type="url" onChange={(e) => setMeetingLink(e.target.value)} />
                                                    </div>
                                                    <Button onClick={() => handleAddLink(booking.id)} disabled={isPending}>
                                                        Save Link
                                                    </Button>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem disabled>Reschedule</DropdownMenuItem>
                                                <DropdownMenuItem disabled>Cancel</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-10">No upcoming sessions.</p>
                )}
            </CardContent>
        </Card>
    );
}

export function UpcomingSessionsSkeleton() {
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
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
