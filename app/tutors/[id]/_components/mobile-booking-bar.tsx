
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Prisma } from "@prisma/client";
import { BookingSidebar } from "./booking-sidebar";

const tutorWithProfile = Prisma.validator<Prisma.UserArgs>()({
    include: { tutorProfile: { include: { availabilities: true } } },
});
type TutorWithProfile = Prisma.UserGetPayload<typeof tutorWithProfile>;

interface MobileBookingBarProps {
  tutor: TutorWithProfile;
}

export function MobileBookingBar({ tutor }: MobileBookingBarProps) {
    const { tutorProfile } = tutor;
    if (!tutorProfile) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between gap-4">
            <div>
                <p className="text-xl font-bold text-primary">${tutorProfile.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="lg" className="flex-grow">Book a Session</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Book a Session</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                        <BookingSidebar tutor={tutor} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
