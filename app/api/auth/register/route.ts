import { AccountStatus, Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/db"

const registerSchema = z.object({
  role: z.enum(["student", "teacher"]),
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  familyName: z.string().min(2, "Family name is required"),
  phone: z.string().min(6, "Phone number is required"),
  email: z.string().email("Invalid email address").transform((value) => value.toLowerCase()),
  university: z.string().min(2, "University is required"),
  yearOfStudy: z.string().min(1, "Year of study is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  agreeToTerms: z.literal("true", {
    errorMap: () => ({ message: "You must agree to the terms of service." }),
  }),
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const parsed = registerSchema.parse({
      role: formData.get("role"),
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName") || undefined,
      familyName: formData.get("familyName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      university: formData.get("university"),
      yearOfStudy: formData.get("yearOfStudy"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      agreeToTerms: formData.get("agreeToTerms"),
    })

    if (parsed.password !== parsed.confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match." },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({
      where: { email: parsed.email },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10)
    const role = parsed.role === "teacher" ? Role.TEACHER : Role.STUDENT
    const status = role === Role.TEACHER ? AccountStatus.PENDING : AccountStatus.ACTIVE

    await db.user.create({
      data: {
        email: parsed.email,
        password: hashedPassword,
        firstName: parsed.firstName,
        middleName: parsed.middleName?.toString() || null,
        familyName: parsed.familyName,
        phone: parsed.phone,
        university: parsed.university,
        academicYear: parsed.yearOfStudy,
        role,
        status,
        name: [parsed.firstName, parsed.middleName, parsed.familyName].filter(Boolean).join(" "),
        tutorProfile:
          role === Role.TEACHER
            ? {
                create: {
                  subjects: [],
                },
              }
            : undefined,
      },
    })

    return NextResponse.json(
      { success: true, message: "Account created successfully. You can now sign in." },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors.map((issue) => issue.message).join(" ") },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    const message = error instanceof Error ? error.message : "Failed to create account. Please try again."
    const isClientSafeError = error instanceof Error && message.includes("Unsupported file type")

    return NextResponse.json(
      {
        success: false,
        error: isClientSafeError ? message : "Failed to create account. Please try again.",
      },
      { status: isClientSafeError ? 400 : 500 }
    )
  }
}
