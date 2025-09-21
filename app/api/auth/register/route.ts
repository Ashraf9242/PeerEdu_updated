import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const RegisterSchema = z.object({
  role: z.enum(["student", "teacher"]),
  firstName: z.string().min(2),
  middleName: z.string().optional(),
  familyName: z.string().min(2),
  phone: z.string().min(6).optional(),
  email: z.string().email(),
  university: z.string().optional(),
  yearOfStudy: z.string().optional(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = RegisterSchema.parse(body)

    // Prevent admin registration from public route
    if (data.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
      return NextResponse.json({ error: "Admin cannot be registered here" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 })

    const passwordHash = await bcrypt.hash(data.password, 10)

    await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role === "teacher" ? "teacher" : "student",
        firstName: data.firstName,
        middleName: data.middleName,
        familyName: data.familyName,
        phone: data.phone,
        university: data.university,
        yearOfStudy: data.yearOfStudy,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    console.error("Register error", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

