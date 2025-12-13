"use server"

import { revalidatePath } from "next/cache"
import type { AccountStatus } from "@prisma/client"

import { requireRole } from "@/auth-utils"
import { db } from "@/lib/db"

const ADMIN_DASHBOARD_PATH = "/dashboard/admin"

export async function updateUserStatusAction(formData: FormData) {
  await requireRole("ADMIN")

  const userId = formData.get("userId")
  const status = formData.get("status")

  if (typeof userId !== "string" || typeof status !== "string") {
    throw new Error("Invalid form payload.")
  }

  const allowedStatuses: AccountStatus[] = ["ACTIVE", "PENDING", "SUSPENDED"]

  if (!allowedStatuses.includes(status as AccountStatus)) {
    throw new Error("Unsupported account status.")
  }

  await db.user.update({
    where: { id: userId },
    data: { status: status as AccountStatus },
  })

  revalidatePath(ADMIN_DASHBOARD_PATH)
}

export async function updateTutorApprovalAction(formData: FormData) {
  await requireRole("ADMIN")

  const userId = formData.get("userId")
  const decision = formData.get("decision")
  const note = formData.get("note")

  if (typeof userId !== "string" || typeof decision !== "string") {
    throw new Error("Invalid form payload.")
  }

  const tutorProfile = await db.tutorProfile.findUnique({
    where: { userId },
  })

  if (!tutorProfile) {
    throw new Error("Tutor profile not found.")
  }

  if (decision === "approve") {
    await db.tutorProfile.update({
      where: { userId },
      data: { isApproved: true, rejectionReason: null },
    })
    await db.user.update({
      where: { id: userId },
      data: { status: "ACTIVE" },
    })
  } else if (decision === "reject") {
    await db.tutorProfile.update({
      where: { userId },
      data: {
        isApproved: false,
        rejectionReason:
          typeof note === "string" && note.trim().length > 0
            ? note.trim()
            : "Returned for revisions by admin.",
      },
    })
    await db.user.update({
      where: { id: userId },
      data: { status: "PENDING" },
    })
  } else {
    throw new Error("Unknown decision.")
  }

  revalidatePath(ADMIN_DASHBOARD_PATH)
}
