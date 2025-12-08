
"use server";

import { db } from "@/lib/db";
import { Prisma, Role } from "@prisma/client";
import { SearchParams } from "../_lib/types";

const PAGE_SIZE = 12;

export async function getTutors(searchParams: SearchParams) {
  const { q, university, subjects, sort, page = "1" } = searchParams;

  const currentPage = parseInt(page, 10) || 1;
  const skip = (currentPage - 1) * PAGE_SIZE;

  const tutorProfileWhere: Prisma.TutorProfileWhereInput = {
    isApproved: true,
  };

  const where: Prisma.UserWhereInput = {
    role: Role.TEACHER,
    tutorProfile: { is: tutorProfileWhere },
  };

  const orderBy: Prisma.UserOrderByWithRelationInput = {};

  // Filters
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { familyName: { contains: q, mode: 'insensitive' } },
      { tutorProfile: { is: { subjects: { has: q } } } },
    ];
  }
  if (university) {
    where.university = university;
  }
  if (subjects) {
    const subjectList = subjects.split(',');
    tutorProfileWhere.subjects = { hasSome: subjectList };
  }
  // Sorting
  switch (sort) {
    case "rating":
      orderBy.tutorProfile = { ratingAvg: "desc" };
      break;
    case "price":
      orderBy.tutorProfile = { hourlyRate: "asc" };
      break;
    case "experience":
      orderBy.tutorProfile = { experience: "desc" };
      break;
    default:
      orderBy.tutorProfile = { ratingAvg: "desc" };
  }

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
