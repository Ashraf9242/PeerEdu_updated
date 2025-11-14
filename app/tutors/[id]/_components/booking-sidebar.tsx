
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Prisma, Availability } from "@prisma/client";
import { format, getDay } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

const tutorWithProfile = Prisma.validator<Prisma.UserArgs>()({
    include: { tutorProfile: { include: { availabilities: true } } },
});
type TutorWithProfile = Prisma.UserGetPayload<typeof tutorWithProfile>;

interface BookingSidebarProps {
  tutor: TutorWithProfile;
}

export function BookingSidebar({ tutor }: BookingSidebarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const { tutorProfile } = tutor;
  if (!tutorProfile) return null;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setSelectedTime(null);
    if (selectedDate) {
      const dayOfWeek = getDay(selectedDate);
      const times = tutorProfile.availabilities
        .filter((a) => a.weekday === dayOfWeek)
        .map(a => `${a.startTime} - ${a.endTime}`); // This is a simplification. A real app would generate slots.
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  };

  const handleBookingClick = () => {
    if (!date || !selectedTime) {
        toast.error("Please select a date and time.");
        return;
    }
    // Logic to proceed to booking page
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Book a Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-bold text-center text-primary">
            ${tutorProfile.hourlyRate}<span className="text-base font-normal text-muted-foreground">/hr</span>
        </p>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
          className="rounded-md border"
        />
        <Select
            onValueChange={setSelectedTime}
            value={selectedTime || ""}
            disabled={!date || availableTimes.length === 0}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
                {availableTimes.length > 0 ? (
                    availableTimes.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))
                ) : (
                    <SelectItem value="no-times" disabled>No available times</SelectItem>
                )}
            </SelectContent>
        </Select>
        <Button asChild className="w-full" size="lg" disabled={!date || !selectedTime}>
            <Link href={`/booking/${tutor.id}?date=${date ? format(date, 'yyyy-MM-dd') : ''}&time=${selectedTime || ''}`}>
                Book Now
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
