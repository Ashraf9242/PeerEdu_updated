
"use server";

import { db } from "@/lib/db";
import { Prisma, Role } from "@prisma/client";
import { SearchParams } from "../_lib/types";
import { UNIVERSITY_VALUE_TO_NAME } from "@/lib/universities";

const PAGE_SIZE = 12;

export async function getTutors(searchParams: SearchParams) {
  const { university, subjectCode, subjectName, teacherName, page = "1" } = searchParams;

  const currentPage = parseInt(page, 10) || 1;
  const skip = (currentPage - 1) * PAGE_SIZE;

  const tutorProfileWhere: Prisma.TutorProfileWhereInput = {
    isApproved: true,
  };

  const tutorProfileFilters: Prisma.TutorProfileWhereInput[] = [];

  if (subjectCode?.trim()) {
    const trimmed = subjectCode.trim();
    const upper = trimmed.toUpperCase();
    const codeOptions = Array.from(new Set([trimmed, upper]));
    tutorProfileFilters.push({
      OR: codeOptions.map((code) => ({ subjects: { has: code } })),
    });
  }

  if (subjectName?.trim()) {
    const trimmed = subjectName.trim();
    tutorProfileFilters.push({ subjects: { has: trimmed } });
  }

  if (tutorProfileFilters.length > 0) {
    tutorProfileWhere.AND = tutorProfileFilters;
  }

  const where: Prisma.UserWhereInput = {
    role: Role.TEACHER,
    tutorProfile: { is: tutorProfileWhere },
  };

  const userFilters: Prisma.UserWhereInput[] = [];

  if (university?.trim()) {
    const trimmed = university.trim();
    const mapped = UNIVERSITY_VALUE_TO_NAME[trimmed] ?? trimmed;
    const values = Array.from(new Set([trimmed, mapped]));
    userFilters.push({
      OR: values.map((value) => ({ university: value })),
    });
  }

  if (teacherName?.trim()) {
    const trimmed = teacherName.trim();
    userFilters.push({
      OR: [
        { firstName: { contains: trimmed, mode: "insensitive" } },
        { middleName: { contains: trimmed, mode: "insensitive" } },
        { familyName: { contains: trimmed, mode: "insensitive" } },
        { name: { contains: trimmed, mode: "insensitive" } },
      ],
    });
  }

  if (userFilters.length > 0) {
    where.AND = userFilters;
  }

  const orderBy: Prisma.UserOrderByWithRelationInput = {
    tutorProfile: { ratingAvg: "desc" },
  };

  try {
    const [tutors, totalTutors] = await db.$transaction([
      db.user.findMany({
        where,
        orderBy,
        skip,
        take: PAGE_SIZE,
        include: {
          tutorProfile: true,
        },
      }),
      db.user.count({ where }),
    ]);

    return {
      tutors,
      totalTutors,
      currentPage,
      totalPages: Math.ceil(totalTutors / PAGE_SIZE),
    };
  } catch (error) {
    console.error("Failed to get tutors:", error);
    return {
        tutors: [],
        totalTutors: 0,
        currentPage: 1,
        totalPages: 1,
        error: "Failed to load tutors."
    };
  }
}

export type TutorsWithProfile = Prisma.PromiseReturnType<typeof getTutors>['tutors'];
