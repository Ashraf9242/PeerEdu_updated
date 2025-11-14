
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TutorProfile } from "@prisma/client";

interface AboutTabProps {
  profile: TutorProfile;
}

export function AboutTab({ profile }: AboutTabProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold">About Me</h3>
          <p className="mt-2 text-muted-foreground">{profile.bio || "No bio provided."}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Experience</h3>
          <p className="mt-2 text-muted-foreground">{profile.experience || "No experience provided."}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Education & Qualifications</h3>
          <p className="mt-2 text-muted-foreground">{profile.education || "No qualifications listed."}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Subjects</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.subjects.map((subject) => (
              <Badge key={subject} variant="secondary">{subject}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
