
"use client";

import { useState } from "react";
import Link from "next/link";
import { format, getDay } from "date-fns";
import type { Availability } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingSidebarProps {
  tutorId: string;
  hourlyRate: number;
  availabilities: Availability[];
}

export function BookingSidebar({ tutorId, hourlyRate, availabilities }: BookingSidebarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setSelectedTime(null);

    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const dayOfWeek = getDay(selectedDate);
    const times = availabilities
      .filter((slot) => slot.weekday === dayOfWeek)
      .map((slot) => `${slot.startTime} - ${slot.endTime}`);

    setAvailableTimes(times);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Book a Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-bold text-center text-primary">
          ${hourlyRate.toFixed(2)}
          <span className="text-base font-normal text-muted-foreground">/hr</span>
        </p>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
          className="rounded-md border"
        />
        <Select onValueChange={setSelectedTime} value={selectedTime ?? ""} disabled={!date || availableTimes.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent>
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-times" disabled>
                No available times
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button asChild className="w-full" size="lg" disabled={!date || !selectedTime}>
          <Link href={`/booking/${tutorId}?date=${date ? format(date, "yyyy-MM-dd") : ""}&time=${selectedTime ?? ""}`}>
            Book Now
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
