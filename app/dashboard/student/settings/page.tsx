import { requireRole } from "@/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "../../_components/dashboard-header"

export default async function StudentSettingsPage() {
  await requireRole("STUDENT")

  return (
    <div className="space-y-8">
      <DashboardHeader title="Settings" subtitle="Personalize your learning experience." />
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            We&apos;re building a richer settings experience for students. Stay tuned for profile, notification, and
            accessibility controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            In the meantime, you can keep booking sessions and rating tutors from your dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
