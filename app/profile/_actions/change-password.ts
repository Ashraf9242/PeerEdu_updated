
"use server";

import { requireAuth } from "@/auth-utils";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const passwordFormSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
});

export async function changePassword(data: z.infer<typeof passwordFormSchema>) {
  try {
    const user = await requireAuth();

    const dbUser = await db.user.findUnique({ where: { id: user.id } });

    if (!dbUser || !dbUser.password) {
      return { error: "User not found or password not set." };
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.currentPassword,
      dbUser.password
    );

    if (!isPasswordCorrect) {
      return { error: "Incorrect current password." };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred." };
  }
}
