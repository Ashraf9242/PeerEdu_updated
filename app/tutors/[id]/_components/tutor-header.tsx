
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Briefcase, BookOpen } from "lucide-react";
import Link from "next/link";
import { Prisma } from "@prisma/client";

const tutorWithProfile = Prisma.validator<Prisma.UserArgs>()({
    include: { tutorProfile: true },
});
type TutorWithProfile = Prisma.UserGetPayload<typeof tutorWithProfile>;

interface TutorHeaderProps {
  tutor: TutorWithProfile;
}

export function TutorHeader({ tutor }: TutorHeaderProps) {
    const { tutorProfile } = tutor;
    if (!tutorProfile) return null;

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "T";
        const names = name.split(' ');
        return names.map(n => n[0]).join('').toUpperCase();
    };

    const hourlyRate = Number(tutorProfile.hourlyRate);
    const averageRating = Number(tutorProfile.ratingAvg ?? 0);

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={tutor.image || ''} alt={tutor.name || 'Tutor'} />
                <AvatarFallback className="text-4xl">{getInitials(tutor.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold">{tutor.name}</h1>
                <p className="text-lg text-muted-foreground mt-1">{tutor.university}</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg text-primary">{averageRating.toFixed(1)}</span>
                        <span className="text-sm">({tutorProfile.ratingCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Briefcase className="w-5 h-5" />
                        <span className="text-sm">{tutorProfile.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-sm">{tutorProfile.ratingCount} sessions completed</span>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-auto flex flex-col items-end gap-2">
                <p className="text-3xl font-bold text-primary">
                    ${hourlyRate.toFixed(2)}<span className="text-base font-normal text-muted-foreground">/hr</span>
                </p>
                <Button asChild size="lg" className="w-full">
                    <Link href={`/booking/${tutor.id}`}>Book a Session</Link>
                </Button>
            </div>
        </div>
    );
}
