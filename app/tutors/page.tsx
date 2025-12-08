
import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, BookOpenCheck, GraduationCap, UsersRound } from "lucide-react";

import { TutorGrid } from "./_components/tutor-grid";
import { FiltersSidebar } from "./_components/filters-sidebar";
import { MobileFilters } from "./_components/mobile-filters";
import { SearchParams } from "./_lib/types";

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

const quickUniversities = [
  { label: "UTAS Ibri", value: "UTAS Ibri" },
  { label: "Sultan Qaboos", value: "Sultan Qaboos University" },
  { label: "German University", value: "German University of Technology" },
];

export default function TutorsPage({ searchParams }: TutorsPageProps) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-10 space-y-6">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center text-primary font-semibold"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to dashboard</span>
          </Link>
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-widest text-primary">
              Smart matching
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Find tutors who already know your college and subject code.
            </h1>
            <p className="text-muted-foreground text-lg">
              Filter by university and subject instantly, then dive deeper with
              keywords. Every tutor listed here is verified, responsive, and ready
              to teach in person or online.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {quickUniversities.map((uni) => (
              <Link
                key={uni.value}
                href={`/tutors?university=${encodeURIComponent(uni.value)}`}
                className="rounded-full border bg-background/80 px-4 py-2 text-sm font-medium text-foreground hover:border-primary"
              >
                {uni.label}
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Verified tutors",
                value: "200+",
                Icon: UsersRound,
              },
              {
                label: "Courses covered",
                value: "320",
                Icon: BookOpenCheck,
              },
              {
                label: "Campuses",
                value: "25",
                Icon: GraduationCap,
              },
            ].map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white/70 p-4 backdrop-blur"
              >
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <FiltersSidebar searchParams={searchParams} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Browse and connect</p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Explore tutors
                </h2>
              </div>
              <MobileFilters searchParams={searchParams} />
            </div>

            <Suspense fallback={<TutorGrid.Skeleton />}>
              <TutorGrid searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
