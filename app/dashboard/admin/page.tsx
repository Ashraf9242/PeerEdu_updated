import { requireRole } from "@/auth-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Admin Dashboard",
}

export default async function AdminDashboardPage() {
  await requireRole("ADMIN")

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>The admin dashboard is coming soon. In the meantime you can continue to manage tutors and students via the database.</p>
        </CardContent>
      </Card>
    </div>
  )
}
