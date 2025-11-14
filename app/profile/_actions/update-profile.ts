
"use server";

import { requireAuth } from "@/auth-utils";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().optional(),
  university: z.string().optional(),
  academicYear: z.string().optional(),
  image: z.string().url().optional(),
});

export async function updateUserProfile(data: z.infer<typeof updateProfileSchema>) {
  const user = await requireAuth();

  const parsedData = updateProfileSchema.parse(data);

  await db.user.update({
    where: { id: user.id },
    data: {
      name: parsedData.name,
      phone: parsedData.phone,
      university: parsedData.university,
      academicYear: parsedData.academicYear,
      image: parsedData.image,
    },
  });

  revalidatePath("/profile");
}
