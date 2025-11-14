
"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Booking, User, Review } from "@prisma/client";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { submitReview } from "../_actions/submit-review";
import { Skeleton } from "@/components/ui/skeleton";

type CompletedBooking = Booking & { tutor: Pick<User, 'name' | 'image'>, review: Review | null };

interface RecentReviewsProps {
    studentId: string;
    recentCompletedSessions: CompletedBooking[];
}

const reviewSchema = z.object({
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().min(10, "Comment must be at least 10 characters.").max(500),
    bookingId: z.string(),
});

// This is the new async component wrapper
export async function RecentReviews({ studentId }: { studentId: string }) {
    const { getStudentDashboardData } = await import("../_actions/get-dashboard-data");
    const { recentCompletedSessions } = await getStudentDashboardData(studentId);

    return <RecentReviewsClient 
        studentId={studentId}
        recentCompletedSessions={recentCompletedSessions}
    />
}

export function RecentReviewsClient({ recentCompletedSessions }: RecentReviewsProps) {
    const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rate Recent Sessions</CardTitle>
                <CardDescription>Review your past sessions to help others.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentCompletedSessions.length > 0 ? (
                    recentCompletedSessions.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={booking.tutor.image || ''} alt={booking.tutor.name || ''} />
                                    <AvatarFallback>{booking.tutor.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{booking.tutor.name}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(booking.startAt), "MMM d, yyyy")}</p>
                                </div>
                            </div>
                            {booking.review ? (
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < booking.review!.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>
                                    ))}
                                </div>
                            ) : (
                                <Dialog open={openDialogs[booking.id] || false} onOpenChange={(isOpen) => setOpenDialogs(prev => ({ ...prev, [booking.id]: isOpen }))}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">Rate Session</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Review your session with {booking.tutor.name}</DialogTitle>
                                            <DialogDescription>
                                                Your feedback is valuable.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ReviewForm bookingId={booking.id} onReviewSubmit={() => setOpenDialogs(prev => ({ ...prev, [booking.id]: false }))} />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No completed sessions yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

function ReviewForm({ bookingId, onReviewSubmit }: { bookingId: string, onReviewSubmit: () => void }) {
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { bookingId, rating: 5, comment: "" },
    });

    const onSubmit = (values: z.infer<typeof reviewSchema>) => {
        startTransition(async () => {
            const result = await submitReview(values);
            if (result.success) {
                toast.success("Review submitted successfully!");
                onReviewSubmit();
            } else {
                toast.error(result.error || "Failed to submit review.");
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                                <StarRating value={field.value} onChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Tell us about your experience..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit Review"}
                </Button>
            </form>
        </Form>
    );
}

function StarRating({ value, onChange }: { value: number, onChange: (value: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-2">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        className="focus:outline-none"
                        onClick={() => onChange(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <Star
                            className={`w-8 h-8 cursor-pointer transition-colors ${ratingValue <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                    </button>
                );
            })}
        </div>
    );
}

export function RecentReviewsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
