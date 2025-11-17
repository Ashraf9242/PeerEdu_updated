"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function approveTutor(tutorProfileId: string) {
  try {
    if (!tutorProfileId) {
      throw new Error("Tutor profile ID is required.")
    }

    await db.tutorProfile.update({
      where: { id: tutorProfileId },
      data: { isApproved: true },
    })

    // Revalidate the admin dashboard path to show updated data
    revalidatePath("/dashboard/admin")

    return { success: true, message: "Tutor approved successfully." }
  } catch (error) {
    console.error("Error approving tutor:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return { success: false, error: errorMessage }
  }
}
