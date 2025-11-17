"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// For rejections, we'll delete the tutor profile.
// A more complex system might move them to a "rejected" state
// or log the reason for rejection. For this implementation, deletion is sufficient.

export async function rejectTutor(tutorProfileId: string) {
  try {
    if (!tutorProfileId) {
      throw new Error("Tutor profile ID is required.")
    }

    // Here, we are deleting the profile. The associated User account will remain.
    await db.tutorProfile.delete({
      where: { id: tutorProfileId },
    })

    // Revalidate the admin dashboard path to show updated data
    revalidatePath("/dashboard/admin")

    return { success: true, message: "Tutor rejected and profile deleted." }
  } catch (error) {
    console.error("Error rejecting tutor:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return { success: false, error: errorMessage }
  }
}
