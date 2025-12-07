import "dotenv/config"
import bcrypt from "bcryptjs"
import { db } from "./lib/db"

async function main() {
  const hashed = await bcrypt.hash("TestPass1!", 10)
  const user = await db.user.create({
    data: {
      email: `script-db-${Date.now()}@example.com`,
      password: hashed,
      firstName: "Script",
      middleName: null,
      familyName: "Test",
      phone: "+96812345678",
      university: "squ",
      academicYear: "study1",
      role: "STUDENT",
      status: "ACTIVE",
      name: "Script Test",
    },
  })
  console.log("created", user.id)
}

main()
  .catch((err) => {
    console.error("db-test error", err)
  })
  .finally(() => db.$disconnect())
