import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import type { Role } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"

import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        adminMode: { label: "Admin Mode", type: "text" },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const adminMode = (credentials as Record<string, string> | undefined)?.adminMode === "true"
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        if (adminMode && user.role !== "ADMIN") {
          throw new Error("ADMIN_ONLY")
        }

        const displayName =
          user.name || [user.firstName, user.familyName].filter(Boolean).join(" ").trim() || user.email

        return {
          id: user.id,
          email: user.email,
          name: displayName,
          role: user.role,
          status: user.status,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.name = token.name ?? session.user.name
        session.user.email = (token.email ?? session.user.email) as string
        session.user.role = token.role as Role
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        const role = (user as { role?: Role }).role
        token.id = user.id
        token.name = user.name
        token.email = user.email
        if (role) {
          token.role = role
        }
      }
      return token
    },
  },
}
