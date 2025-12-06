import { requireRole } from "@/auth-utils"
import { DashboardHeader } from "../../_components/dashboard-header"
import { TeacherProfileSettingsCard } from "./_components/profile-settings-card"
import { SubjectRegistrationCard } from "./_components/subject-registration-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"

export default async function TeacherSettingsPage() {
  const sessionUser = await requireRole("TEACHER")
  const teacher = await db.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      firstName: true,
      middleName: true,
      familyName: true,
      phone: true,
      email: true,
    },
  })

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Teacher Settings"
        subtitle="Fine tune your teaching profile and keep your expertise front and center."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <TeacherProfileSettingsCard
          teacher={{
            firstName: teacher?.firstName ?? sessionUser.name ?? "",
            middleName: teacher?.middleName ?? "",
            familyName: teacher?.familyName ?? "",
            phone: teacher?.phone ?? "",
            email: teacher?.email ?? sessionUser.email ?? "teacher@peeredu.com",
          }}
        />
        <div className="space-y-8 lg:col-span-2">
          <SubjectRegistrationCard />
          <Card>
            <CardHeader>
              <CardTitle>Teaching preferences</CardTitle>
              <CardDescription>Keep students informed about your availability and learning style.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Update your time slots from the availability manager.</p>
              <p>• Use subject registration to highlight your strongest tracks.</p>
              <p>• Keep your profile photo and bio consistent across languages.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
