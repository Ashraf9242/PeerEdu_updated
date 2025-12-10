"use server"

import { requireRole } from "@/auth-utils"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateTeacherProfileSchema = z.object({
  prefix: z.enum(["Mr.", "Ms."]),
  firstName: z.string().min(2, "First name is required."),
  middleName: z.string().optional(),
  familyName: z.string().min(2, "Family name is required."),
  phone: z.string().min(6, "Phone number must contain at least 6 digits."),
  bio: z.string().max(1000).optional(),
})

export async function updateTeacherProfile(input: z.infer<typeof updateTeacherProfileSchema>) {
  const teacher = await requireRole("TEACHER")
  const data = updateTeacherProfileSchema.parse(input)

  await db.user.update({
    where: { id: teacher.id },
    data: {
      firstName: data.firstName,
      middleName: data.middleName?.length ? data.middleName : null,
      familyName: data.familyName,
      phone: data.phone,
      name: `${data.prefix} ${data.firstName} ${data.familyName}`.trim(),
    },
  })

  await db.tutorProfile.upsert({
    where: { userId: teacher.id },
    update: { bio: data.bio ?? null },
    create: {
      userId: teacher.id,
      bio: data.bio ?? null,
      subjects: [],
    },
  })

  revalidatePath("/dashboard/teacher")
  revalidatePath("/dashboard/teacher/settings")
}
