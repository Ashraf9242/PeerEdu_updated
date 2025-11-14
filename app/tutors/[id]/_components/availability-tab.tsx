
import { Card, CardContent } from "@/components/ui/card";
import { Availability } from "@prisma/client";
import { Clock } from "lucide-react";

interface AvailabilityTabProps {
  availabilities: Availability[];
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function AvailabilityTab({ availabilities }: AvailabilityTabProps) {
  const availabilityByDay = WEEKDAYS.map((day, index) => ({
    day,
    slots: availabilities
      .filter((a) => a.weekday === index)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {availabilityByDay.map(({ day, slots }) => (
            <div key={day} className="grid grid-cols-4 gap-4 items-start">
              <h4 className="font-semibold col-span-1">{day}</h4>
              <div className="col-span-3">
                {slots.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-2 bg-muted text-muted-foreground rounded-md px-3 py-1 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
