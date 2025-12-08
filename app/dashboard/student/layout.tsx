import type { ReactNode } from "react"

import { DashboardNavigation } from "@/components/dashboard-navigation"

const studentLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/dashboard/student", labelKey: "dashboard.nav.dashboard" },
  { href: "/dashboard/student#sessions", labelKey: "dashboard.nav.sessions" },
  { href: "/dashboard/student/settings", labelKey: "dashboard.nav.settings" },
]

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/10">
      <DashboardNavigation links={studentLinks} />
      <main className="container mx-auto px-4 py-10">{children}</main>
    </div>
  )
}
