import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudentDashboardData } from "../_actions/get-dashboard-data";
import { UpcomingSessionsClient, type BookingWithTutor } from "./upcoming-sessions-client";

interface UpcomingSessionsProps {
  studentId: string;
  initialData?: {
    upcomingSessions: BookingWithTutor[];
    pendingRequests: BookingWithTutor[];
  };
}

export async function UpcomingSessions({ studentId, initialData }: UpcomingSessionsProps) {
  let data = initialData;

  if (!data) {
    const fetched = await getStudentDashboardData(studentId);
    data = {
      upcomingSessions: fetched.upcomingSessions,
      pendingRequests: fetched.pendingRequests,
    };
  }

  return (
    <UpcomingSessionsClient
      studentId={studentId}
      upcomingSessions={data.upcomingSessions}
      pendingRequests={data.pendingRequests}
    />
  );
}

export function UpcomingSessionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
