
import { Suspense } from 'react';
import { Metadata } from 'next';
import { TutorGrid } from './_components/tutor-grid';
import { FiltersSidebar } from './_components/filters-sidebar';
import { MobileFilters } from './_components/mobile-filters';
import { getTutors } from './_actions/get-tutors';
import { SearchParams } from './_lib/types';

interface TutorsPageProps {
  searchParams: SearchParams;
}

export async function generateMetadata({ searchParams }: TutorsPageProps): Promise<Metadata> {
  const { q, university, subjects, sort } = searchParams;
  let title = 'Find the Best Tutors';
  if (q) title = `Results for "${q}"`;
  else if (university) title = `Tutors at ${university}`;
  else if (subjects) title = `Tutors for ${subjects.split(',').join(', ')}`;

  return {
    title: `${title} | PeerEdu`,
    description: 'Search and filter through our expert tutors to find the perfect match for your learning needs.',
  };
}

export default function TutorsPage({ searchParams }: TutorsPageProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <FiltersSidebar searchParams={searchParams} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Explore Tutors
            </h1>
            {/* Mobile Filters Trigger */}
            <MobileFilters searchParams={searchParams} />
          </div>
          
          <Suspense fallback={<TutorGrid.Skeleton />}>
            <TutorGrid searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
