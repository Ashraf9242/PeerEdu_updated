import { PrismaClient, BookingStatus, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  try {
    // 1. Clean up existing data to avoid conflicts
    console.log("Cleaning up database...")
    await prisma.review.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.availability.deleteMany()
    await prisma.tutorProfile.deleteMany()
    await prisma.user.deleteMany()
    console.log("Database cleaned.")

    // 2. Hash passwords
    const testPassword = await bcrypt.hash("Test@123", 10)
    const adminPassword = await bcrypt.hash("Admin@123", 10)

    // 3. Create Admin User
    console.log("Creating admin user...")
    const admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        familyName: "User",
        email: "admin@peeredu.om",
        phone: "+96890000000",
        password: adminPassword,
        university: "PeerEdu",
        role: UserRole.ADMIN,
      },
    })
    console.log(`Created admin user: ${admin.email}`)

    // 4. Create Students
    console.log("Creating student users...")
    const student1 = await prisma.user.create({
      data: {
        firstName: "أحمد",
        familyName: "الخروصي",
        email: "ahmed@squ.edu.om",
        phone: "+96891111111",
        password: testPassword,
        university: "Sultan Qaboos University",
        role: UserRole.STUDENT,
      },
    })

    const student2 = await prisma.user.create({
      data: {
        firstName: "فاطمة",
        familyName: "المعمرية",
        email: "fatima@utas.edu.om",
        phone: "+96892222222",
        password: testPassword,
        university: "UTAS Ibri",
        role: UserRole.STUDENT,
      },
    })

    const student3 = await prisma.user.create({
      data: {
        firstName: "سالم",
        familyName: "الحارثي",
        email: "salim@mct.edu.om",
        phone: "+96893333333",
        password: testPassword,
        university: "Muscat University",
        role: UserRole.STUDENT,
      },
    })
    console.log("Created 3 student users.")

    // 5. Create Tutors with TutorProfiles
    console.log("Creating tutor users with profiles...")
    const tutorsData = [
      { user: { firstName: "خالد", familyName: "الرواحي", email: "khalid@tutor.com", university: "Sultan Qaboos University" }, profile: { subjects: ["Mathematics", "Physics"], hourlyRate: 10, experience: "3 years of tutoring", education: "B.Sc. in Engineering", ratingAvg: 4.5, ratingCount: 20 } },
      { user: { firstName: "مريم", familyName: "البلوشية", email: "maryam@tutor.com", university: "UTAS Ibri" }, profile: { subjects: ["Programming", "Data Structures"], hourlyRate: 15, experience: "Lead developer at a startup", education: "B.Sc. in IT", ratingAvg: 4.8, ratingCount: 35 } },
      { user: { firstName: "يوسف", familyName: "الشعيلي", email: "yusuf@tutor.com", university: "German University of Technology" }, profile: { subjects: ["English", "History"], hourlyRate: 8, experience: "Certified English teacher", education: "B.A. in English Literature", ratingAvg: 4.2, ratingCount: 15 } },
      { user: { firstName: "عائشة", familyName: "الزدجالية", email: "aisha@tutor.com", university: "University of Nizwa" }, profile: { subjects: ["Chemistry"], hourlyRate: 12, experience: "Lab assistant for 2 years", education: "B.Sc. in Chemistry", ratingAvg: 4.9, ratingCount: 25 } },
      { user: { firstName: "علي", familyName: "الحسني", email: "ali@tutor.com", university: "Dhofar University" }, profile: { subjects: ["Physics", "Calculus"], hourlyRate: 7, experience: "Physics enthusiast", education: "B.Sc. in Physics", ratingAvg: 4.0, ratingCount: 10 } },
    ]

    const createdTutors = await Promise.all(
      tutorsData.map(async (tutor) =>
        prisma.user.create({
          data: {
            ...tutor.user,
            phone: `+9689${Math.floor(10000000 + Math.random() * 90000000)}`.slice(0, 12),
            password: testPassword,
            role: UserRole.TEACHER,
            tutorProfile: {
              create: { ...tutor.profile, isApproved: true },
            },
          },
        })
      )
    )
    console.log(`Created ${createdTutors.length} tutor users.`)

    // 6. Create Availabilities
    console.log("Creating availabilities for tutors...")
    for (const tutor of createdTutors) {
      await prisma.availability.createMany({
        data: [
          { tutorId: tutor.id, weekday: 1, startTime: "16:00", endTime: "18:00" }, // Monday
          { tutorId: tutor.id, weekday: 3, startTime: "18:00", endTime: "20:00" }, // Wednesday
          { tutorId: tutor.id, weekday: 5, startTime: "10:00", endTime: "12:00" }, // Friday
        ],
      })
    }
    console.log("Created availabilities.")

    // 7. Create Bookings
    console.log("Creating bookings...")
    const now = new Date()
    const bookings = await prisma.booking.createMany({
      data: [
        // Completed
        { studentId: student1.id, tutorId: createdTutors[0].id, subject: "Mathematics", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 3600000), price: 10 },
        { studentId: student2.id, tutorId: createdTutors[1].id, subject: "Programming", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 3600000), price: 15 },
        { studentId: student3.id, tutorId: createdTutors[2].id, subject: "English", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 3600000), price: 8 },
        { studentId: student1.id, tutorId: createdTutors[3].id, subject: "Chemistry", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 3600000), price: 12 },
        { studentId: student2.id, tutorId: createdTutors[4].id, subject: "Physics", status: BookingStatus.COMPLETED, startAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 3600000), price: 7 },
        // Confirmed
        { studentId: student1.id, tutorId: createdTutors[1].id, subject: "Programming", status: BookingStatus.CONFIRMED, startAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 3600000), price: 15 },
        { studentId: student2.id, tutorId: createdTutors[0].id, subject: "Physics", status: BookingStatus.CONFIRMED, startAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3600000), price: 10 },
        // Pending
        { studentId: student3.id, tutorId: createdTutors[4].id, subject: "Calculus", status: BookingStatus.PENDING, startAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 3600000), price: 7 },
        { studentId: student1.id, tutorId: createdTutors[2].id, subject: "English", status: BookingStatus.PENDING, startAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 3600000), price: 8 },
        { studentId: student3.id, tutorId: createdTutors[3].id, subject: "Chemistry", status: BookingStatus.PENDING, startAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 3600000), price: 12 },
      ],
    })
    console.log(`Created ${bookings.count} bookings.`)

    // 8. Create Reviews for completed bookings
    console.log("Creating reviews for completed bookings...")
    const completedBookings = await prisma.booking.findMany({
      where: { status: BookingStatus.COMPLETED },
    })

    for (const booking of completedBookings) {
      await prisma.review.create({
        data: {
          bookingId: booking.id,
          rating: Math.floor(Math.random() * 3) + 3, // 3 to 5 stars
          comment: "Great session, very helpful!",
        },
      })
    }
    console.log(`Created ${completedBookings.length} reviews.`)

    console.log("Seeding finished successfully.")
  } catch (error) {
    console.error("Error during seeding:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()