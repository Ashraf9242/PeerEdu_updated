import { NextResponse, type NextRequest } from "next/server"
import { differenceInMinutes, parse } from "date-fns"
import { Prisma } from "@prisma/client"
import * as z from "zod"

import { requireAuth } from "@/auth-utils"
import { db } from "@/lib/db"

const availabilitySchema = z
  .object({
    weekday: z.number().min(0).max(6),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  })
  .refine(
    (data) => {
      const start = parse(data.startTime, "HH:mm", new Date())
      const end = parse(data.endTime, "HH:mm", new Date())
      return start < end
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      const start = parse(data.startTime, "HH:mm", new Date())
      const end = parse(data.endTime, "HH:mm", new Date())
      return differenceInMinutes(end, start) >= 60
    },
    {
      message: "Availability slot must be at least 1 hour",
      path: ["endTime"],
    }
  )

/**
 * 5. Helper Function: للتحقق من عدم التداخل
 */
async function checkOverlap(tutorId: string, weekday: number, startTime: string, endTime: string, excludeId?: string) {
  const whereClause: Prisma.AvailabilityWhereInput = {
    tutorId,
    weekday,
    id: excludeId ? { not: excludeId } : undefined,
    OR: [
      { startTime: { lt: endTime }, endTime: { gt: startTime } }, // Overlap condition
    ],
  }

  const overlappingSlots = await db.availability.count({
    where: whereClause,
  })

  return overlappingSlots > 0
}

/**
 * 1. GET: جلب الأوقات المتاحة للمعلم
 */
export async function GET() {
  try {
    const user = await requireAuth()
    const availabilities = await db.availability.findMany({
      where: { tutorId: user.id },
      orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
    })
    return NextResponse.json({ success: true, availabilities })
  } catch (error) {
    console.error("[AVAILABILITY_GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

/**
 * 2. POST: إضافة وقت جديد
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const data = availabilitySchema.parse(body)

    const hasOverlap = await checkOverlap(user.id, data.weekday, data.startTime, data.endTime)
    if (hasOverlap) {
      return NextResponse.json({ success: false, error: "Time slot overlaps with an existing one." }, { status: 409 })
    }

    const availability = await db.availability.create({
      data: {
        tutorId: user.id,
        ...data,
      },
    })

    return NextResponse.json({ success: true, availability }, { status: 201 })
  } catch (error) {
    console.error("[AVAILABILITY_POST]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 422 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

/**
 * 3. PUT: تعديل وقت موجود
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Availability ID is required." }, { status: 400 })
    }

    const availability = await db.availability.findFirst({
      where: { id, tutorId: user.id },
    })

    if (!availability) {
      return NextResponse.json({ success: false, error: "Availability not found or you don't have permission." }, { status: 404 })
    }

    const body = await req.json()
    const data = availabilitySchema.parse(body)

    const hasOverlap = await checkOverlap(user.id, data.weekday, data.startTime, data.endTime, id)
    if (hasOverlap) {
      return NextResponse.json({ success: false, error: "Time slot overlaps with an existing one." }, { status: 409 })
    }

    const updatedAvailability = await db.availability.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, availability: updatedAvailability })
  } catch (error) {
    console.error("[AVAILABILITY_PUT]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 422 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

/**
 * 4. DELETE: حذف وقت
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Availability ID is required." }, { status: 400 })
    }

    const availability = await db.availability.findFirst({
      where: { id, tutorId: user.id },
    })

    if (!availability) {
      return NextResponse.json({ success: false, error: "Availability not found or you don't have permission." }, { status: 404 })
    }

    await db.availability.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[AVAILABILITY_DELETE]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}