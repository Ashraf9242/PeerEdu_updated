
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Prisma, TutorProfile } from "@prisma/client";
import { Star } from "lucide-react";
import { format } from 'date-fns';

const profileWithReviews = Prisma.validator<Prisma.TutorProfileArgs>()({
    include: {
        reviews: {
            include: {
                booking: {
                    include: {
                        student: {
                            select: { name: true, image: true },
                        },
                    },
                },
            },
        },
    },
});
type ProfileWithReviews = Prisma.TutorProfileGetPayload<typeof profileWithReviews>;

interface ReviewsTabProps {
  profile: ProfileWithReviews;
}

export function ReviewsTab({ profile }: ReviewsTabProps) {
    const { reviews, ratingAvg, ratingCount } = profile;

    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => r.rating === stars).length;
        const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
        return { stars, count, percentage };
    });

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "S";
        const names = name.split(' ');
        return names.map(n => n[0]).join('').toUpperCase();
    };

    return (
        <Card>
            <CardContent className="pt-6 space-y-8">
                {/* Stats */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Rating Statistics</h3>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="text-4xl font-bold">{ratingAvg?.toFixed(1)}</p>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < Math.round(ratingAvg || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">Based on {ratingCount} reviews</p>
                        </div>
                        <div className="flex-grow space-y-2">
                            {ratingDistribution.map(({ stars, count, percentage }) => (
                                <div key={stars} className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground w-12">{stars} stars</span>
                                    <Progress value={percentage} className="w-full h-2" />
                                    <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                     <h3 className="text-lg font-semibold">Latest Reviews</h3>
                     {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={review.booking.student.image || ''} />
                                    <AvatarFallback>{getInitials(review.booking.student.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{review.booking.student.name || 'Anonymous'}</p>
                                        <span className="text-xs text-muted-foreground">{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                                </div>
                            </div>
                        ))
                     ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No reviews yet.</p>
                     )}
                </div>
            </CardContent>
        </Card>
    );
}
