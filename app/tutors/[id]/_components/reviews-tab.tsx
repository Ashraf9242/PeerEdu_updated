import { format } from "date-fns"
import type { Review } from "@prisma/client"
import { Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type ReviewWithStudent = Review & {
  booking: {
    student: {
      name: string | null
      image: string | null
    }
  }
}

interface ReviewsTabProps {
  ratingAvg: number
  ratingCount: number
  reviews: ReviewWithStudent[]
}

export function ReviewsTab({ ratingAvg, ratingCount, reviews }: ReviewsTabProps) {
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length
    const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0
    return { stars, count, percentage }
  })

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "S"
    const parts = name.trim().split(" ")
    return parts.map((segment) => segment[0]).join("").toUpperCase()
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Rating Statistics</h3>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-4xl font-bold">{ratingAvg.toFixed(1)}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(ratingAvg) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
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

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Latest Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={review.booking.student.image ?? undefined} />
                  <AvatarFallback>{getInitials(review.booking.student.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.booking.student.name || "Anonymous"}</p>
                    <span className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
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
  )
}
