import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Prisma, User, UserRole } from "@prisma/client"

import { authOptions } from "@/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import { searchParamsSchema } from "@/lib/validations/params"
import { SearchParams } from "@/types"
 
import { UserStatCards } from "./users/_components/user-stat-cards" // Assuming stats are in a sub-folder
import { UsersDataTable } from "./users/_components/users-data-table"
import { columns } from "./users/_components/columns"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"

export const metadata = {
  title: "Users Management",
  description: "Manage all users in the system.",
}

interface AdminUsersPageProps {
  searchParams: SearchParams
}

async function getUsersData(searchParams: AdminUsersPageProps["searchParams"]) {
  const { page, per_page, sort, name, email, role, status, from, to } =
    searchParamsSchema.parse(searchParams)

  const pageAsNumber = Number(page)
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
  const perPageAsNumber = Number(per_page)
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
  const offset = (fallbackPage - 1) * limit

  const [column, order] = (sort?.split(".") as [
    keyof User | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  // Here you would fetch the data from your database
  // For demonstration, we'll use a placeholder.
  // Replace this with your actual Prisma query.
  const { data, pageCount } = await getUsers({
    limit,
    offset,
    sort: { column, order },
    filters: { name, email, role, status, from, to },
  })

  return { data, pageCount }
}

// This is a placeholder for your actual data fetching logic
interface GetUsersParams {
  limit: number
  offset: number
  sort: {
    column: keyof User | undefined
    order: "asc" | "desc" | undefined
  }
  filters: {
    name?: string
    email?: string
    role?: string
    status?: string
    from?: string
    to?: string
  }
}

async function getUsers(params: GetUsersParams) {
  console.log("Fetching users with params:", params)
  const { limit, offset, sort, filters } = params

  // This is where you'll build your Prisma query based on the filters.
  // This is a basic example. You'll need to expand it.
  const nameFilter = filters.name
    ? {
        OR: [
          { name: { contains: filters.name, mode: "insensitive" } },
          { email: { contains: filters.name, mode: "insensitive" } },
        ],
      }
    : {}

  const where: Prisma.UserWhereInput = {
    ...nameFilter,
    role: filters.role ? (filters.role as UserRole) : undefined,
    status: filters.status ? filters.status : undefined,
    // Assuming 'university' is a relation, adjust if it's a simple field
    // university: filters.university ? { name: filters.university } : undefined,
    createdAt: {
      gte: filters.from ? new Date(filters.from) : undefined,
      lte: filters.to ? new Date(filters.to) : undefined,
    },
  }

  const users = await db.user.findMany({
    take: limit,
    skip: offset,
    where,
    orderBy: {
      [sort.column ?? "createdAt"]: sort.order ?? "desc",
    },
  })
  const totalUsers = await db.user.count({
    where,
  })

  return {
    data: users,
    pageCount: Math.ceil(totalUsers / limit),
  }
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== UserRole.ADMIN) {
    redirect("/dashboard")
  }

  const usersPromise = getUsersData(searchParams)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
      </div>
      <UserStatCards />
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={8} filterableColumnCount={4} />
        }
      >
        <UsersDataTable columns={columns} dataPromise={usersPromise} />
      </Suspense>
    </div>
  )
}