import { requireRole } from "@/auth-utils"
import { TeacherProfileSettingsCard } from "./_components/profile-settings-card"
import { SubjectRegistrationCard } from "./_components/subject-registration-card"
import { TeacherSettingsHeader } from "./_components/teacher-settings-header"
import { TeachingPreferencesCard } from "./_components/teaching-preferences-card"
import { db } from "@/lib/db"

export default async function TeacherSettingsPage() {
  const sessionUser = await requireRole("TEACHER")
  const teacher = await db.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      name: true,
      firstName: true,
      middleName: true,
      familyName: true,
      phone: true,
      email: true,
      tutorProfile: {
        select: {
          bio: true,
        },
      },
    },
  })
  const prefixFromName = (() => {
    const raw = teacher?.name?.split(" ")[0] ?? ""
    return raw === "Mr." || raw === "Ms." ? raw : undefined
  })()

  return (
    <div className="space-y-8">
      <TeacherSettingsHeader />

      <div className="grid gap-8 lg:grid-cols-7">
        <TeacherProfileSettingsCard
          teacher={{
            prefix: prefixFromName,
            firstName: teacher?.firstName ?? sessionUser.name ?? "",
            middleName: teacher?.middleName ?? "",
            familyName: teacher?.familyName ?? "",
            phone: teacher?.phone ?? "",
            email: teacher?.email ?? sessionUser.email ?? "teacher@peeredu.com",
            bio: teacher?.tutorProfile?.bio ?? "",
          }}
        />
        <div className="space-y-8 lg:col-span-3">
          <SubjectRegistrationCard />
          <TeachingPreferencesCard />
        </div>
      </div>
    </div>
  )
}
