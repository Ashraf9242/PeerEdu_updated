import type { ReactNode } from "react"

import { DashboardNavigation } from "@/components/dashboard-navigation"

const teacherLinks = [
  { href: "/dashboard/teacher", labelKey: "dashboard.nav.dashboard" },
  { href: "/dashboard/teacher/sessions", labelKey: "dashboard.nav.sessions" },
  { href: "/dashboard/teacher/settings", labelKey: "dashboard.nav.settings" },
]

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/10">
      <DashboardNavigation links={teacherLinks} />
      <main className="container mx-auto px-4 py-10">{children}</main>
    </div>
  )
}
