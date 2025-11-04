import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"

import { db } from "@/lib/db" // افتراض وجود Prisma client هنا

// قائمة الجامعات المعتمدة
const OMAN_UNIVERSITIES = [
  "UTAS Ibri",
  "Sultan Qaboos University",
  "German University of Technology",
  "University of Nizwa",
  "Dhofar University",
  "Muscat University",
  "UTAS Muscat",
  "UTAS Sohar",
  "UTAS Salalah",
  "UTAS Nizwa",
  "Other",
] as const

// 1. Validation قوي باستخدام Zod
const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters long." }),
  familyName: z.string().min(2, { message: "Family name must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^\+968[79]\d{7}$/, { message: "Invalid Omani phone number. Must be in +9689... or +9687... format." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])(?=.*\d).+$/, {
      message: "Password must contain at least one uppercase letter and one number.",
    }),
  university: z.enum(OMAN_UNIVERSITIES, {
    errorMap: () => ({ message: "Please select a valid university." }),
  }),
})

// 5. Security: Rate Limiting (مثال بسيط في الذاكرة)
const requests = new Map<string, { count: number; lastRequest: number }>()
const RATE_LIMIT_WINDOW = 60000 // نافذة زمنية: 60 ثانية
const RATE_LIMIT_COUNT = 5 // 5 طلبات كحد أقصى في النافذة الزمنية

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = requests.get(ip)

  if (!record) {
    requests.set(ip, { count: 1, lastRequest: now })
    return false
  }

  if (now - record.lastRequest > RATE_LIMIT_WINDOW) {
    requests.set(ip, { count: 1, lastRequest: now })
    return false
  }

  if (record.count >= RATE_LIMIT_COUNT) {
    return true
  }

  record.count++
  return false
}

export async function POST(req: Request) {
  // تطبيق Rate Limiting
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { firstName, familyName, email, phone, password, university } = validation.data

    // 2. التحقق من تكرار البريد الإلكتروني
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "This email is already registered. / هذا البريد الإلكتروني مسجل بالفعل." },
        { status: 409 } // 409 Conflict
      )
    }

    // 3. حفظ البيانات
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await db.user.create({
      data: {
        firstName,
        familyName,
        email,
        phone,
        password: hashedPassword,
        university,
        role: "STUDENT", // Use the Prisma enum for type safety
      },
    })

    // 4. Response ناجح (مع عدم إرجاع كلمة المرور)
    return NextResponse.json(
      { success: true, message: "Registration successful. / تم التسجيل بنجاح." },
      { status: 201 }
    )
  } catch (error) {
    console.error("[REGISTER_API_ERROR]", error)
    return NextResponse.json({ success: false, error: "An internal server error occurred." }, { status: 500 })
  }
}