
import { Suspense } from "react";
import { Metadata } from "next";

import { TutorGrid } from "./_components/tutor-grid";
import { FiltersSidebar } from "./_components/filters-sidebar";
import { SearchParams } from "./_lib/types";
import { TutorsHero } from "./_components/tutors-hero";
import { TutorsResultsHeader } from "./_components/tutors-results-header";
import { UNIVERSITY_VALUE_TO_NAME } from "@/lib/universities";

interface TutorsPageProps {
  searchParams: SearchParams;
}

export async function generateMetadata({ searchParams }: TutorsPageProps): Promise<Metadata> {
  const { university, subjectCode, subjectName } = searchParams;
  let title = "Find the Best Tutors";

  if (university) {
    const resolved = UNIVERSITY_VALUE_TO_NAME[university] ?? university;
    title = `Tutors at ${resolved}`;
  } else if (subjectCode) {
    title = `Tutors for ${subjectCode.toUpperCase()}`;
  } else if (subjectName) {
    title = `Tutors for ${subjectName}`;
  }

  return {
    title: `${title} | PeerEdu`,
    description: "Search and filter through our expert tutors to find the perfect match for your learning needs.",
  };
}

export default function TutorsPage({ searchParams }: TutorsPageProps) {
  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <TutorsHero />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="space-y-4 lg:sticky lg:top-24">
              <FiltersSidebar searchParams={searchParams} className="shadow-sm" />
            </div>
          </aside>

          <main className="space-y-6 lg:col-span-3">
            <TutorsResultsHeader searchParams={searchParams} />
            <Suspense fallback={<TutorGrid.Skeleton />}>
              <TutorGrid searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
