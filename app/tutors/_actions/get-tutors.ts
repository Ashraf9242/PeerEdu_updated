
"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { SearchParams } from "../_lib/types";

const PAGE_SIZE = 12;

export async function getTutors(searchParams: SearchParams) {
  const { q, university, subjects, minPrice, maxPrice, rating, sort, page = '1' } = searchParams;

  const currentPage = parseInt(page, 10) || 1;
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where: Prisma.UserWhereInput = {
    role: 'TEACHER',
    tutorProfile: {
      is: {
        isApproved: true,
      },
    },
  };

  const orderBy: Prisma.UserOrderByWithRelationInput = {};

  // Filters
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { familyName: { contains: q, mode: 'insensitive' } },
      { tutorProfile: { subjects: { has: q } } },
    ];
  }
  if (university) {
    where.university = university;
  }
  if (subjects) {
    const subjectList = subjects.split(',');
    where.tutorProfile.is.subjects = { hasSome: subjectList };
  }
  if (minPrice || maxPrice) {
      where.tutorProfile.is.hourlyRate = {};
      if (minPrice) where.tutorProfile.is.hourlyRate.gte = parseInt(minPrice, 10);
      if (maxPrice) where.tutorProfile.is.hourlyRate.lte = parseInt(maxPrice, 10);
  }
  if (rating) {
    where.tutorProfile.is.ratingAvg = { gte: parseInt(rating, 10) };
  }

  // Sorting
  switch (sort) {
    case 'rating':
      orderBy.tutorProfile = { ratingAvg: 'desc' };
      break;
    case 'price':
      orderBy.tutorProfile = { hourlyRate: 'asc' };
      break;
    case 'experience':
      orderBy.tutorProfile = { experience: 'desc' }; // Assuming experience is a sortable field
      break;
    default:
      orderBy.tutorProfile = { ratingAvg: 'desc' };
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
