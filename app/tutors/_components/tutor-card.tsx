
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

import { TutorsWithProfile } from "../_actions/get-tutors";

interface TutorCardProps {
  tutor: TutorsWithProfile[0];
}

const omrFormatter = new Intl.NumberFormat("en-OM", {
  style: "currency",
  currency: "OMR",
  minimumFractionDigits: 2,
});

export function TutorCard({ tutor }: TutorCardProps) {
  const { tutorProfile } = tutor;

  if (!tutorProfile) {
    return null;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "T";
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  const hourlyRate = omrFormatter.format(Number(tutorProfile.hourlyRate) || 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={tutor.image || ""} alt={tutor.name || "Tutor"} />
          <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{tutor.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{tutor.university}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-wrap gap-2">
          {tutorProfile.subjects.slice(0, 3).map((subject) => (
            <Badge key={subject} variant="secondary">
              {subject}
            </Badge>
          ))}
          {tutorProfile.subjects.length > 3 && (
            <Badge variant="outline">+{tutorProfile.subjects.length - 3}</Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-primary">
              {Number(tutorProfile.ratingAvg ?? 0).toFixed(1)}
            </span>
            <span>({tutorProfile.ratingCount} reviews)</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-primary">{hourlyRate}</span>
            <span className="ml-1 text-xs">/hour</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on {tutorProfile.ratingCount} completed sessions.
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="outline" asChild>
          <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
        </Button>
        <Button asChild>
          <Link href={`/booking/${tutor.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
