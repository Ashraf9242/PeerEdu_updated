
import { getTutors } from "../_actions/get-tutors";
import { SearchParams } from "../_lib/types";
import { TutorGridClient } from "./tutor-grid-client";
import { Skeleton } from "@/components/ui/skeleton";

interface TutorGridProps {
  searchParams: SearchParams;
}

export async function TutorGrid({ searchParams }: TutorGridProps) {
  const data = await getTutors(searchParams);
  return <TutorGridClient {...data} />;
}

TutorGrid.Skeleton = function TutorGridSkeleton() {
    return (
        <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
    )
}
