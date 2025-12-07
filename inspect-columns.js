const { PrismaClient } = require('@prisma/client')

async function main() {
  const db = new PrismaClient()
  const rows = await db.$queryRaw`SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public'`
  console.log(rows)
  await db.$disconnect()
}

main().catch(async (err) => {
  console.error('schema error', err)
  process.exit(1)
})
