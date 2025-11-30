
"use client";

import type { Availability } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { BookingSidebar } from "./booking-sidebar";

interface MobileBookingBarProps {
  tutorId: string;
  hourlyRate: number;
  availabilities: Availability[];
}

export function MobileBookingBar({ tutorId, hourlyRate, availabilities }: MobileBookingBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-xl font-bold text-primary">
          ${hourlyRate.toFixed(2)}
          <span className="text-sm font-normal text-muted-foreground">/hr</span>
        </p>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="lg" className="flex-grow">
            Book a Session
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Book a Session</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <BookingSidebar tutorId={tutorId} hourlyRate={hourlyRate} availabilities={availabilities} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
