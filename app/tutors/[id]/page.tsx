
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Metadata } from 'next';
import { TutorHeader } from './_components/tutor-header';
import { BookingSidebar } from './_components/booking-sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AboutTab } from './_components/about-tab';
import { AvailabilityTab } from './_components/availability-tab';
import { ReviewsTab } from './_components/reviews-tab';
import { MobileBookingBar } from './_components/mobile-booking-bar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface TutorDetailsPageProps {
  params: { id: string };
}

async function getTutorData(id: string) {
  const tutor = await db.user.findUnique({
    where: { id, role: 'TEACHER' },
    include: {
      tutorProfile: {
        include: {
          reviews: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              booking: {
                include: {
                  student: {
                    select: { name: true },
                  },
                },
              },
            },
          },
          availabilities: true,
        },
      },
    },
  });
  return tutor;
}

export async function generateMetadata({ params }: TutorDetailsPageProps): Promise<Metadata> {
  const tutor = await getTutorData(params.id);

  if (!tutor || !tutor.tutorProfile) {
    return {
      title: 'Tutor Not Found | PeerEdu',
    };
  }

  const subjects = tutor.tutorProfile.subjects.join(', ');
  const title = `${tutor.name} - ${subjects} Tutor`;
  const description = `Book a session with ${tutor.name}, an expert in ${subjects}. ${tutor.tutorProfile.bio?.substring(0, 150)}...`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: tutor.image || '/placeholder-logo.png',
          width: 1200,
          height: 630,
          alt: tutor.name || 'Tutor',
        },
      ],
    },
  };
}

export default async function TutorDetailsPage({ params }: TutorDetailsPageProps) {
  const tutor = await getTutorData(params.id);

  if (!tutor || !tutor.tutorProfile) {
    notFound();
  }

  if (!tutor.tutorProfile.isApproved) {
    return (
        <div className="container mx-auto py-20 text-center">
            <Alert variant="destructive" className="max-w-lg mx-auto">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Profile Not Available</AlertTitle>
                <AlertDescription>
                    This tutor's profile is currently under review and not publicly visible.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <TutorHeader tutor={tutor} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-6">
                <AboutTab profile={tutor.tutorProfile} />
            </TabsContent>
            <TabsContent value="availability" className="mt-6">
                <AvailabilityTab availabilities={tutor.tutorProfile.availabilities} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
                <ReviewsTab profile={tutor.tutorProfile} />
            </TabsContent>
          </Tabs>
        </div>
        <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
                <BookingSidebar tutor={tutor} />
            </div>
        </aside>
      </div>
      <MobileBookingBar tutor={tutor} />
    </div>
  );
}
