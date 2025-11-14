
"use server";

import { db } from "@/lib/db";

export async function getFilterData() {
  try {
    const universities = await db.user.findMany({
      where: {
        role: 'TEACHER',
        tutorProfile: { is: { isApproved: true } },
        university: { not: null },
      },
      distinct: ['university'],
      select: { university: true },
    });

    const subjects = await db.tutorProfile.findMany({
        where: { isApproved: true },
        select: { subjects: true },
    });

    const allSubjects = [...new Set(subjects.flatMap(p => p.subjects))];
    const allUniversities = [...new Set(universities.map(u => u.university!))];


    return {
      universities: allUniversities,
      subjects: allSubjects,
    };
  } catch (error) {
    console.error("Failed to get filter data:", error);
    return { universities: [], subjects: [] };
  }
}
