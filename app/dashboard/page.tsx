import { redirect } from "next/navigation"

import { getCurrentUser } from "@/auth-utils"

export default async function DashboardIndexPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/dashboard")
  }

  const target =
    user.role === "TEACHER"
      ? "/dashboard/teacher"
      : user.role === "ADMIN"
        ? "/dashboard/admin"
        : "/dashboard/student"

  redirect(target)
}
