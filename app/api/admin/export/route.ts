import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") ?? "users"

  switch (type) {
    case "users": {
      const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
      })
      const csv = toCsv(
        ["id", "name", "email", "role", "status", "university", "createdAt"],
        users.map((user) => ({
          id: user.id,
          name: user.name ?? "",
          email: user.email,
          role: user.role,
          status: user.status,
          university: user.university ?? "",
          createdAt: user.createdAt.toISOString(),
        })),
      )
      return buildCsvResponse(csv, "peeredu-users.csv")
    }
    case "bookings": {
      const bookings = await db.booking.findMany({
        include: { student: true, tutor: true },
        orderBy: { createdAt: "desc" },
      })
      const csv = toCsv(
        ["id", "student", "tutor", "subject", "status", "price", "startAt", "endAt"],
        bookings.map((booking) => ({
          id: booking.id,
          student: booking.student?.email ?? "",
          tutor: booking.tutor?.email ?? "",
          subject: booking.subject,
          status: booking.status,
          price: booking.price.toString(),
          startAt: booking.startAt.toISOString(),
          endAt: booking.endAt.toISOString(),
        })),
      )
      return buildCsvResponse(csv, "peeredu-bookings.csv")
    }
    default:
      return new NextResponse("Unsupported export type", { status: 400 })
  }
}

function toCsv(columns: string[], rows: Record<string, string>[]) {
  const header = columns.join(",")
  const lines = rows.map((row) =>
    columns
      .map((column) => {
        const value = row[column] ?? ""
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      .join(","),
  )
  return [header, ...lines].join("\n")
}

function buildCsvResponse(csv: string, filename: string) {
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${filename}`,
    },
  })
}
