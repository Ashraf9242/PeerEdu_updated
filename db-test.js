const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const db = new PrismaClient()
  const hashed = await bcrypt.hash('TestPass1!', 10)
  const user = await db.user.create({
    data: {
      email: `cli-db-${Date.now()}@example.com`,
      password: hashed,
      firstName: 'Script',
      middleName: null,
      familyName: 'Test',
      phone: '+96812345678',
      university: 'squ',
      academicYear: 'study1',
      role: 'STUDENT',
      status: 'ACTIVE',
      name: 'Script Test'
    }
  })
  console.log('created', user.id)
  await db.$disconnect()
}

main().catch(async (err) => {
  console.error('db-js error', err)
  process.exit(1)
})
