import { PrismaClient, BookingStatus, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const buildFullName = (first: string, middle?: string | null, family?: string | null) =>
  [first, middle, family].filter(Boolean).join(" ")

async function main() {
  console.log("Start seeding...")

  try {
    console.log("Cleaning up database...")
    await prisma.review.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.availability.deleteMany()
    await prisma.tutorProfile.deleteMany()
    await prisma.user.deleteMany()
    console.log("Database cleaned.")

    const testPassword = await bcrypt.hash("Test@123", 10)
    const adminPassword = await bcrypt.hash("Admin@123", 10)

    console.log("Creating admin user...")
    await prisma.user.create({
      data: {
        name: "Admin User",
        firstName: "Admin",
        familyName: "User",
        email: "admin@peeredu.om",
        phone: "+96890000000",
        password: adminPassword,
        university: "PeerEdu",
        role: Role.ADMIN,
      },
    })

    console.log("Creating student users...")
    const students = await Promise.all([
      prisma.user.create({
        data: {
          name: "Ahmed Al Balushi",
          firstName: "Ahmed",
          familyName: "Al Balushi",
          email: "ahmed@squ.edu.om",
          phone: "+96891111111",
          password: testPassword,
          university: "Sultan Qaboos University",
          academicYear: "Year 3",
          role: Role.STUDENT,
        },
      }),
      prisma.user.create({
        data: {
          name: "Fatima Al Harrasi",
          firstName: "Fatima",
          familyName: "Al Harrasi",
          email: "fatima@utas.edu.om",
          phone: "+96892222222",
          password: testPassword,
          university: "UTAS Ibri",
          academicYear: "Year 2",
          role: Role.STUDENT,
        },
      }),
      prisma.user.create({
        data: {
          name: "Salim Al Mahri",
          firstName: "Salim",
          familyName: "Al Mahri",
          email: "salim@mct.edu.om",
          phone: "+96893333333",
          password: testPassword,
          university: "Muscat University",
          academicYear: "Year 4",
          role: Role.STUDENT,
        },
      }),
    ])
    console.log("Created student users.")

    console.log("Creating tutor users with profiles...")
    const tutorsData = [
      {
        firstName: "Khalid",
        familyName: "Al Rawahi",
        email: "khalid@tutor.com",
        university: "Sultan Qaboos University",
        subjects: ["Mathematics", "Physics"],
        hourlyRate: 10,
        experience: "3 years of tutoring",
        education: "B.Sc. in Engineering",
        ratingAvg: 4.5,
        ratingCount: 20,
      },
      {
        firstName: "Maryam",
        familyName: "Al Busaidi",
        email: "maryam@tutor.com",
        university: "UTAS Ibri",
        subjects: ["Programming", "Data Structures"],
        hourlyRate: 15,
        experience: "Lead developer at a startup",
        education: "B.Sc. in IT",
        ratingAvg: 4.8,
        ratingCount: 35,
      },
      {
        firstName: "Yusuf",
        familyName: "Al Shukaili",
        email: "yusuf@tutor.com",
        university: "German University of Technology",
        subjects: ["English", "History"],
        hourlyRate: 8,
        experience: "Certified English teacher",
        education: "B.A. in English Literature",
        ratingAvg: 4.2,
        ratingCount: 15,
      },
      {
        firstName: "Aisha",
        familyName: "Al Zadjali",
        email: "aisha@tutor.com",
        university: "University of Nizwa",
        subjects: ["Chemistry"],
        hourlyRate: 12,
        experience: "Lab assistant for 2 years",
        education: "B.Sc. in Chemistry",
        ratingAvg: 4.9,
        ratingCount: 25,
      },
      {
        firstName: "Ali",
        familyName: "Al Hasani",
        email: "ali@tutor.com",
        university: "Dhofar University",
        subjects: ["Physics", "Calculus"],
        hourlyRate: 7,
        experience: "Physics enthusiast",
        education: "B.Sc. in Physics",
        ratingAvg: 4.0,
        ratingCount: 10,
      },
    ]

    const tutors = await Promise.all(
      tutorsData.map((tutor) =>
        prisma.user.create({
          data: {
            name: buildFullName(tutor.firstName, null, tutor.familyName),
            firstName: tutor.firstName,
            familyName: tutor.familyName,
            email: tutor.email,
            phone: `+9689${Math.floor(10000000 + Math.random() * 90000000)}`.slice(0, 12),
            password: testPassword,
            university: tutor.university,
            role: Role.TEACHER,
            tutorProfile: {
              create: {
                subjects: tutor.subjects,
                hourlyRate: tutor.hourlyRate,
                experience: tutor.experience,
                education: tutor.education,
                ratingAvg: tutor.ratingAvg,
                ratingCount: tutor.ratingCount,
                isApproved: true,
              },
            },
          },
        })
      )
    )
    console.log("Created tutor users.")

    console.log("Creating availabilities...")
    for (const tutor of tutors) {
      await prisma.availability.createMany({
        data: [
          { tutorId: tutor.id, weekday: 1, startTime: "16:00", endTime: "18:00" },
          { tutorId: tutor.id, weekday: 3, startTime: "18:00", endTime: "20:00" },
          { tutorId: tutor.id, weekday: 5, startTime: "10:00", endTime: "12:00" },
        ],
      })
    }
    console.log("Created availabilities.")

    console.log("Creating bookings...")
    const now = new Date()
    await prisma.booking.createMany({
      data: [
        { studentId: students[0].id, tutorId: tutors[0].id, subject: "Mathematics", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 3600000), price: 10 },
        { studentId: students[1].id, tutorId: tutors[1].id, subject: "Programming", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 3600000), price: 15 },
        { studentId: students[2].id, tutorId: tutors[2].id, subject: "English", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 3600000), price: 8 },
        { studentId: students[0].id, tutorId: tutors[3].id, subject: "Chemistry", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 3600000), price: 12 },
        { studentId: students[1].id, tutorId: tutors[4].id, subject: "Physics", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 3600000), price: 7 },
        { studentId: students[0].id, tutorId: tutors[1].id, subject: "Programming", status: BookingStatus.CONFIRMED, startAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 3600000), price: 15 },
        { studentId: students[1].id, tutorId: tutors[0].id, subject: "Physics", status: BookingStatus.CONFIRMED, startAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3600000), price: 10 },
        { studentId: students[2].id, tutorId: tutors[4].id, subject: "Calculus", status: BookingStatus.PENDING, startAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 3600000), price: 7 },
        { studentId: students[0].id, tutorId: tutors[2].id, subject: "English", status: BookingStatus.PENDING, startAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 3600000), price: 8 },
        { studentId: students[2].id, tutorId: tutors[3].id, subject: "Chemistry", status: BookingStatus.PENDING, startAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 3600000), price: 12 },
      ],
    })
    console.log("Created bookings.")

    console.log("Creating reviews...")
    const completedBookings = await prisma.booking.findMany({
      where: { status: BookingStatus.COMPLETED },
    })

    for (const booking of completedBookings) {
      await prisma.review.create({
        data: {
          bookingId: booking.id,
          rating: Math.floor(Math.random() * 3) + 3,
          comment: "Great session, very helpful!",
        },
      })
    }
    console.log("Reviews created.")

    console.log("Seeding finished successfully.")
  } catch (error) {
    console.error("Error during seeding:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
