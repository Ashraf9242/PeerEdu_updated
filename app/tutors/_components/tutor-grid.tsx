
import { getTutors } from "../_actions/get-tutors";
import { SearchParams } from "../_lib/types";
import { TutorCard } from "./tutor-card";
import { PaginationControls } from "./pagination-controls";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TutorGridProps {
  searchParams: SearchParams;
}

export async function TutorGrid({ searchParams }: TutorGridProps) {
  const { tutors, totalTutors, currentPage, totalPages, error } = await getTutors(searchParams);

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-2xl font-semibold">No Tutors Found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search filters.
        </p>
      </div>
    );
  }

  const from = (currentPage - 1) * 12 + 1;
  const to = Math.min(currentPage * 12, totalTutors);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-8">
        <p className="text-sm text-muted-foreground">
          Showing {from}-{to} of {totalTutors} tutors
        </p>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
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
