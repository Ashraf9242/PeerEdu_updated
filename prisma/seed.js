const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    console.log("No ADMIN_EMAIL/ADMIN_PASSWORD set. Skipping admin seed.")
    return
  }

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (existing) {
    console.log("Admin already exists")
    return
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12)
  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: "admin",
      firstName: "Admin",
      familyName: "User",
    },
  })
  console.log("Admin created")
}

main().finally(async () => {
  await prisma.$disconnect()
})

