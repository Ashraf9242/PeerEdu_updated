import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudentDashboardData } from "../_actions/get-dashboard-data";
import { RecentReviewsClient } from "./recent-reviews-client";

interface RecentReviewsProps {
  studentId: string;
  initialData?: {
    recentCompletedSessions: Awaited<
      ReturnType<typeof getStudentDashboardData>
    >["recentCompletedSessions"];
  };
}

export async function RecentReviews({ studentId, initialData }: RecentReviewsProps) {
  let sessions = initialData?.recentCompletedSessions;

  if (!sessions) {
    const fetched = await getStudentDashboardData(studentId);
    sessions = fetched.recentCompletedSessions;
  }

  return (
    <RecentReviewsClient
      studentId={studentId}
      recentCompletedSessions={sessions}
    />
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
  );
}
