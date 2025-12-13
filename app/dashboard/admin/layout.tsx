import type { ReactNode } from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navigation />
      <main className="container mx-auto flex-1 px-4 py-10">{children}</main>
      <Footer />
    </div>
  )
}
