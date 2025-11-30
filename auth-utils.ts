import { Role } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { authOptions } from "@/auth"

export type AppUser = {
  id: string
  role: Role
  name: string | null
  email: string | null
  image?: string | null
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }

  const { id, role, name, email, image } = session.user
  return { id, role, name: name ?? null, email: email ?? null, image }
}

export async function requireAuth(): Promise<AppUser> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireRole(role: Role): Promise<AppUser> {
  const user = await requireAuth()

  if (user.role !== role) {
    redirect(`/dashboard/${user.role.toLowerCase()}`)
  }

  return user
}
